/*
 * RERO ILS UI
 * Copyright (C) 2024-2025 RERO
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
import { AfterViewInit, Component, inject, OnDestroy } from '@angular/core';
import { ApiService, RemoteAutocomplete } from '@rero/ng-core';
import { PERMISSIONS, PermissionsService } from '@rero/shared';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { AddEntityLocalFormComponent } from './add-entity-local-form/add-entity-local-form.component';

@Component({
    selector: 'admin-entity-autocomplete',
    template: `
      <div class="ui:flex ui:w-full">
        @if (!field.formControl.value) {
          @if (props.filters?.options) {
            <div class="ui:flex">
              <p-select
                [options]="optionValues$|async"
                [ngModel]="props.filters.selected"
                (onChange)="changeFilter($event)"
              >
              <ng-template let-selected #selectedItem>
                {{ selected.untranslatedLabel | translate }}
              </ng-template>
              </p-select>
            </div>
          }
          <div class="ui:flex ui:ml-1 ui:w-full">
            <p-autoComplete
              class="ui:w-full"
              styleClass="ui:w-full"
              inputStyleClass="ui:w-full"
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
          <div class="ui:py-1 ui:flex ui:gap-1 ui:items-center">
            <span [innerHtml]="valueSelected()"></span>
            <p-button icon="fa fa-trash" severity="secondary" [text]="true" (onClick)="clear()" />
          </div>
        }
      </div>`,
    standalone: false
})
export class EntityAutocompleteComponent extends RemoteAutocomplete implements OnDestroy, AfterViewInit {

  private permissionsService: PermissionsService = inject(PermissionsService);
  private dialogService: DialogService = inject(DialogService);
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
