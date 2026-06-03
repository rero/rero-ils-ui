/*
 * RERO ILS UI
 * Copyright (C) 2019-2025 RERO
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
import { ResolveFn, Routes } from '@angular/router';
import { _ } from '@ngx-translate/core';
import { ActionStatus, RecordData, RecordSearchPageComponent, RecordType, RouteDataTypesInterface } from '@rero/ng-core';
import { EntityBriefViewComponent, PERMISSIONS } from '@rero/shared';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseRoute } from './base-route';

export const entitiesRouteResolver: ResolveFn<Partial<RecordType>[]> = () =>
  new EntitiesRoute().getTypes();

export const entitiesRoutes: Routes = [
  {
    path: '',
    component: RecordSearchPageComponent,
    title: _('Entities'),
  },
];

class EntitiesRoute extends BaseRoute implements RouteDataTypesInterface {
  /** Route name */
  readonly name = 'entities';

  /** Record type */
  readonly recordType = 'local_entities';

  private _options = [
    { label: _('Relevance'), value: 'bestmatch', defaultQuery: true },
    { label: _('Date (newest)'), value: '-created' },
    { label: _('Date (oldest)'), value: 'created' },
    { label: _('Name'), value: 'fr_name' },
  ];

  getTypes(): Partial<RecordType>[] {
    return [
      {
        key: 'entities',
        index: 'entities',
        label: _('Entities'),
        component: EntityBriefViewComponent,
        canAdd: () =>
          of({
            can: this.routeToolService.appStore.canAccess(PERMISSIONS.LOCENT_CREATE),
            routerLink: ['/records', this.recordType, 'new'],
          } as ActionStatus),
        canUpdate: (record: RecordData) => this._buildUpdatePermission(record),
        canDelete: (record: RecordData) => this._buildDeletePermission(record),
        aggregationsName: {
          resource_type: _('Source'),
          type: _('Type'),
          source_catalog: _('Source catalog'),
        },
        showFacetsIfNoResults: false,
        allowEmptySearch: true,
        aggregationsOrder: ['resource_type', 'type', 'source_catalog'],
        aggregationsExpand: ['resource_type', 'type', 'source_catalog'],
        aggregationsBucketSize: 10,
        itemHeaders: {
          Accept: 'application/rero+json, application/json',
        },
        listHeaders: {
          Accept: 'application/rero+json, application/json',
        },
        sortOptions: this._sortOptions(),
      },
    ];
  }

  /**
   * Generating update route permissions and parameters
   * @param record - the current record
   * @returns Observable
   */
  private _buildUpdatePermission(record: any): Observable<ActionStatus> {
    if (record.metadata.resource_type !== 'local') {
      return of({ can: false, message: '' });
    }
    return this.routeToolService.permissions(record, this.recordType).pipe(
      map((permissions: any) => {
        return {
          can: permissions?.canUpdate?.can || false,
          message: permissions?.canUpdate?.message || '',
          routerLink: ['/records', this.recordType, 'edit', record.metadata.pid],
        };
      })
    );
  }

  /**
   * Generating delete route permissions and parameters
   * @param record - the current record
   * @returns Observable
   */
  private _buildDeletePermission(record: any): Observable<ActionStatus> {
    if (record.metadata.resource_type !== 'local') {
      return of({ can: false, message: '' });
    }
    return this.routeToolService.permissions(record, this.recordType).pipe(
      map((permissions: any) => {
        return {
          can: permissions?.canDelete?.can || false,
          message: permissions?.canDelete?.message || '',
          type: this.recordType,
        };
      })
    );
  }

  /**
   * Sort configuration
   * @returns array with sort configuration
   */
  private _sortOptions() {
    const options = this._options;
    this.routeToolService.translateService.onLangChange.subscribe((translate: any) => {
      const key = options.findIndex((option: any) => option.label === 'Name');
      switch (translate.lang) {
        case 'de':
          options[key].value = 'de_name';
          break;
        case 'en':
          options[key].value = 'en_name';
          break;
        case 'it':
          options[key].value = 'it_name';
          break;
        default:
          options[key].value = 'fr_name';
      }
    });
    return options;
  }
}
