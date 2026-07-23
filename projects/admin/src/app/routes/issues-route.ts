// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { ResolveFn, Routes } from '@angular/router';
import { _ } from '@ngx-translate/core';
import { Bucket, IFilter, RecordData, RecordSearchPageComponent, RecordService, RecordType, RouteDataTypesInterface } from '@rero/ng-core';
import { IssueItemStatus, PERMISSIONS } from '@rero/shared';
import { map, Observable, of } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { permissionGuard } from '../guard/permission.guard';
import { IssuesBriefViewComponent } from '../record/brief-view/issues-brief-view/issues-brief-view.component';
import { BaseRoute } from './base-route';

export const issuesRouteResolver: ResolveFn<Partial<RecordType>[]> = () =>
  new IssuesRoute().getTypes();

export const issuesRoutes: Routes = [
  {
    path: '',
    component: RecordSearchPageComponent,
    title: _('Late issues'),
    canActivate: [permissionGuard],
    data: {
      permissions: [PERMISSIONS.ISSUE_MANAGEMENT],
    },
  },
];

class IssuesRoute extends BaseRoute implements RouteDataTypesInterface {
  protected recordService = inject(RecordService);

  /** Route name */
  readonly name = 'issues';

  /** Record type */
  readonly recordType = 'items';

  getTypes(): Partial<RecordType>[] {
    const types: Partial<RecordType>[] = [
      {
        key: this.name,
        label: 'Issues',
        index: 'items',
        component: IssuesBriefViewComponent,
        searchFilters: [this.expertSearchFilter()],
        permissions: (record: RecordData) => this.routeToolService.permissions(record, this.recordType),
        processBucketName: (bucket: Bucket) => this.processBucketName(bucket),
        processFilterName: (filter: IFilter) => this.processFilterName(filter),
        preFilters: {
          or_issue_status: [IssueItemStatus.LATE],
        },
        aggregationsBucketSize: 10,
        aggregationsOrder: ['library', 'location', 'item_type', 'vendor', 'claims_count', 'claims_date'],
        aggregationsExpand: ['library'],
        listHeaders: {
          Accept: 'application/rero+json, application/json',
        },
        exportFormats: [
          {
            label: 'CSV',
            format: 'csv',
            endpoint: this.routeToolService.apiService.getEndpointByType('item/inventory'),
            disableMaxRestResultsSize: true,
          },
        ],
        showFacetsIfNoResults: true,
      },
    ];
    // TODO: Refactor this after the change of AppInitializer service with user.
    toObservable(this.routeToolService.appStore.user, { injector: this.routeToolService.injector })
      .pipe(filter(u => !!u), take(1)).subscribe(() => {
        const { patronLibrarian } = this.routeToolService.appStore.user();
        if (patronLibrarian) {
          (types[0].preFilters as any).organisation = patronLibrarian.organisation.pid;
        }
      });
    return types;
  }

  private processBucketName(bucket: Bucket): Observable<string> {
    if(bucket.name) { return of(bucket.name); }
    switch (bucket.aggregationKey) {
      case 'claims_count': {
        const count = Number(bucket.key);
        const key = count < 2 ? _('{{count}} claim') : _('{{count}} claims');
        return this.routeToolService.translateService.stream(key, { count });
      };
      default: return this.routeToolService.translateService.stream(bucket.key);
    }
  }

  private processFilterName(filter: IFilter): Observable<string> {
    if(filter.name) { return of(filter.name); }
    switch (filter.aggregationKey) {
      case 'claims_count': return this.routeToolService.translateService.stream(_('Claims'));
      case 'item_type': return this.recordService.getRecord<{metadata: {name: string}}>('item_types', filter.key).pipe(map(record => record.metadata.name));
      case 'library': return this.recordService.getRecord<{metadata: {name: string}}>('libraries', filter.key).pipe(map(record => record.metadata.name));
      case 'location': return this.recordService.getRecord<{metadata: {name: string}}>('locations', filter.key).pipe(map(record => record.metadata.name));
      case 'vendor': return this.recordService.getRecord<{metadata: {name: string}}>('vendors', filter.key).pipe(map(record => record.metadata.name));
      default: return this.routeToolService.translateService.stream(filter.key);
    }
  }
}
