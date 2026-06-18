// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { AfterViewInit, Component, inject, OnDestroy, ChangeDetectionStrategy} from '@angular/core';
import { ApiService, RemoteAutocompleteComponent } from '@rero/ng-core';
import { AppStore, PERMISSIONS } from '@rero/shared';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { AddEntityLocalFormComponent } from './add-entity-local-form/add-entity-local-form.component';
import { Bind } from 'primeng/bind';
import { Select } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { AutoComplete } from 'primeng/autocomplete';
import { NgClass } from '@angular/common';
import { Button } from 'primeng/button';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'admin-entity-autocomplete',
    template: `
    <div class="ui:grid ui:grid-cols-12 ui:gap-2">
      @if (!field.formControl.value) {
        @if (props.filters?.options) {
          <div class="ui:col-span-4">
            <p-select
              [fluid]="true"
              [options]="optionValues()"
              [ngModel]="props.filters.selected"
              (onChange)="changeFilter($event)"
            >
            <ng-template let-selected #selectedItem>
              {{ selected.untranslatedLabel | translate }}
            </ng-template>
            </p-select>
          </div>
        }
        <div class="ui:col-span-8">
          <p-autoComplete
            [fluid]="true"
            [class]="props['styleClass']"
            [scrollHeight]="props.scrollHeight"
            [minLength]="props.minLength"
            [maxlength]="props.maxLength"
            [(ngModel)]="value"
            [placeholder]="props.placeholder"
            [group]="props.group"
            [suggestions]="suggestions()"
            (completeMethod)="search($event)"
            (onSelect)="onSelect($event)"
          >
            <ng-template #group let-data>
              <span class="ui:font-bold">
                @if (data.label === 'local' && isAuthorizedToAddLocalEntity) {
                  {{ "link to local authority" | translate }}&nbsp;
                  <i
                    class="fa fa-plus-square-o ui:text-xl ui:text-blue-500 ui:hover:text-blue-700 ui:cursor-pointer"
                    [title]="'Add local entity'|translate"
                    aria-hidden="true"
                    (click)="addLocalEntity($event)"
                  ></i>
                } @else {
                  {{ "link to authority {{ sourceName }}" | translate:{ sourceName: data.label } }}
                }
              </span>
            </ng-template>
            <ng-template let-data #item>
              <div class="ui:flex ui:gap-2 ui:items-center">
                <div class="ui:flex" [innerHTML]="data.label"></div>
                @if (data.link) {
                  <a class="ui:ml-1 ui:text-surface-700" (click)="$event.stopPropagation()" [href]="data.link" target="_blank">
                    <i class="fa fa-external-link"></i>
                  </a>
                }
                @if (data.summary) {
                  <div class="ui:italic ui:text-sm ui:text-gray-500" [innerHTML]="data.summary" [ngClass]="props.summaryClass"></div>
                }
              </div>
            </ng-template>
          </p-autoComplete>
        </div>
      } @else {
        <div class="ui:col-span-12">
          <span [innerHtml]="valueSelected()"></span>
          <p-button icon="fa fa-trash" severity="secondary" [text]="true" (onClick)="clear()" />
        </div>
      }
    </div>`,
    imports: [Bind, Select, FormsModule, AutoComplete, NgClass, Button, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EntityAutocompleteComponent extends RemoteAutocompleteComponent implements OnDestroy, AfterViewInit {

  private appStore = inject(AppStore);
  private dialogService: DialogService = inject(DialogService);
  private apiService: ApiService = inject(ApiService);

  isAuthorizedToAddLocalEntity = false;

  private subscription: Subscription = new Subscription();

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.isAuthorizedToAddLocalEntity = this.appStore.canAccess(PERMISSIONS.LOCENT_CREATE);
    super.ngAfterViewInit();
  }

  addLocalEntity(event: Event): void {
    event.preventDefault();
    const dialog: DynamicDialogRef = this.dialogService.open(AddEntityLocalFormComponent, {
      header: this.translateService.instant('Add local entity'),
      focusOnShow: false,
      modal: true,
      width: '75vw',
      data: {
        selectedType: this.props.queryOptions.filter,
        searchTerm: this.value
      }
    });

    this.subscription.add(dialog.onClose.subscribe((data) => {
      if (data) {
        const link = this.apiService.getRefEndpoint('local_entities', data.metadata.pid);
        this.onValueSelect.next({
          item: { label: link, value: link },
          queryOptions: this.field.props.queryOptions,
        });
        this.formControl.patchValue(link);
      }
    }));
  }
}
