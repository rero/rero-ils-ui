/*
 * RERO ILS UI
 * Copyright (C) 2024 RERO
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, version 3 of the License.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
import { Component, inject, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ApiService, RemoteAutocomplete } from '@rero/ng-core';
import { PERMISSIONS, PermissionsService } from '@rero/shared';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AddEntityLocalFormComponent } from './add-entity-local-form/add-entity-local-form.component';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'admin-entity-autocomplete',
  template: `
  <div class="flex w-full">
    @if (!field.formControl.value) {
      @if (props.filters?.options) {
        <div class="flex">
          <p-dropdown
            [options]="props.filters.options"
            [ngModel]="props.filters.selected"
            (onChange)="changeFilter($event)"
          ></p-dropdown>
        </div>
      }
      <div class="flex ml-1 w-full">
        <p-autoComplete
          class="w-full"
          styleClass="w-full"
          inputStyleClass="w-full"
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
          <ng-template let-data pTemplate="group">
            <span class="font-bold">
              @if (data.label === 'local' && isAuthorizedToAddLocalEntity) {
                {{ "link to local authority" | translate }}
                <i
                  class="fa fa-plus-square-o ml-2 text-lg"
                  title="{{ 'Add local entity' | translate }}"
                  aria-hidden="true"
                  (click)="addLocalEntity($event)"
                ></i>
              } @else {
                {{ "link to authority {{ sourceName }}" | translate:{ sourceName: data.label } }}
              }
            </span>
          </ng-template>
          <ng-template let-data pTemplate="item">
            <div class="flex">
              <div class="flex" [innerHTML]="data.label"></div>
              @if (data.link) {
                <a class="ml-2 text-700" (click)="$event.stopPropagation()" [href]="data.link" target="_blank">
                  <i class="fa fa-external-link"></i>
                </a>
              }
            </div>
            @if (data.summary) {
              <div [innerHTML]="data.summary" [ngClass]="props.summaryClass"></div>
            }
          </ng-template>
        </p-autoComplete>
      </div>
    } @else {
      <div class="py-1">
        <span [innerHtml]="valueSelected()"></span>
        <p-button icon="fa fa-trash" severity="secondary" [text]="true" (onClick)="clear()" styleClass="ml-1" />
      </div>
    }
  </div>`
})
export class EntityAutocompleteComponent extends RemoteAutocomplete implements OnDestroy {

  private permissionsService: PermissionsService = inject(PermissionsService);
  private dialogService: DialogService = inject(DialogService);
  private translateService: TranslateService = inject(TranslateService);
  private apiService: ApiService = inject(ApiService);

  isAuthorizedToAddLocalEntity = false;

  private subscription: Subscription = new Subscription();

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.isAuthorizedToAddLocalEntity = this.permissionsService.canAccess(PERMISSIONS.LOCENT_CREATE);
    super.ngAfterViewInit();
  }

  addLocalEntity(event: Event): void {
    event.preventDefault();
    const dialog: DynamicDialogRef = this.dialogService.open(AddEntityLocalFormComponent, {
      header: this.translateService.instant('Add local entity'),
      width: '75vw',
      modal: true,
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
