/*
 * RERO ILS UI
 * Copyright (C) 2019-2024 RERO
 * Copyright (C) 2019-2023 UCLouvain
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
import { Component, EventEmitter, inject, Input, OnDestroy, Output } from '@angular/core';
import { ApiService, NgCoreTranslateService, SuggestionMetadata } from '@rero/ng-core';
import { PERMISSIONS, PermissionsService } from '@rero/shared';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { AddEntityLocalFormComponent } from './add-entity-local-form/add-entity-local-form.component';
import { EntityTypeFilter } from './entity-typeahead.interface';

@Component({
  selector: 'admin-add-entity-local',
  template: `
  @if (canAdd) {
    <button class="btn btn-sm btn-primary mt-2" (click)="addEntity()">
      <i class="fa fa-plus-square-o" aria-hidden="true"></i>
      {{ 'Add local entity' | translate }}
    </button>
  }
  `
})
export class AddEntityLocalComponent implements OnDestroy {

  private dialogService: DialogService = inject(DialogService);
  private permissionService: PermissionsService = inject(PermissionsService);
  private translateService: NgCoreTranslateService = inject(NgCoreTranslateService);
  private apiService: ApiService = inject(ApiService);

  /** Available types for typeahead select */
  @Input() entityTypeFilters: EntityTypeFilter[];

  /** Text searched by user */
  @Input() searchTerm: string;

  /** Event for record create */
  @Output() recordCreate: EventEmitter<any> = new EventEmitter();

  private subscription = new Subscription();

  /**
   * Is the button available for adding a locale entity?
   * @returns boolean
   */
  get canAdd(): boolean {
    return this.permissionService.canAccess(PERMISSIONS.LOCENT_CREATE);
  }

  ngOnDestroy(): void {
      this.subscription.unsubscribe();
  }

  /** Open the dialog to add an entity */
  addEntity(): void {
    const ref: DynamicDialogRef = this.dialogService.open(AddEntityLocalFormComponent, {
      dismissableMask: true,
      data: {
        entityTypeFilters: this.entityTypeFilters,
        searchTerm: this.searchTerm
      }
    });
    this.subscription.add(
      ref.onClose.subscribe((record?: any) => {
        if (record) {
          const item: SuggestionMetadata = {
            label: record.metadata.name,
            value: this.apiService.getRefEndpoint('local_entities', record.metadata.pid),
            externalLink: `/records/local_entities/detail/${record.metadata.pid}`,
            group: this.translateService.instant('link to local authority')
          };
          this.recordCreate.emit(new TypeaheadMatch(item, item.label))
        }
      })
    );
  }
}
