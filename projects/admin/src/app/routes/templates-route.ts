// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
import { inject } from '@angular/core';
import { ResolveFn, Routes } from '@angular/router';
import { _ } from '@ngx-translate/core';
import {
  ActionStatus,
  ComponentCanDeactivateGuard,
  DetailComponent,
  EditorComponent,
  RecordData,
  RecordSearchPageComponent,
  RecordType,
  RouteDataTypesInterface,
} from '@rero/ng-core';
import { AppStore, PERMISSIONS, PERMISSION_OPERATOR } from '@rero/shared';
import { Observable, Subscriber } from 'rxjs';
import { CAN_ACCESS_ACTIONS, canAccessGuard } from '../guard/can-access.guard';
import { permissionGuard } from '../guard/permission.guard';
import { TemplatesBriefViewComponent } from '../record/brief-view/templates-brief-view.component';
import { TemplateDetailViewComponent } from '../record/detail-view/template-detail-view/template-detail-view.component';
import { BaseRoute } from './base-route';

export const templatesRouteResolver: ResolveFn<Partial<RecordType>[]> = () =>
  new TemplatesRoute().getTypes();

export const templatesRoutes: Routes = [
  {
    path: '',
    component: RecordSearchPageComponent,
    title: _('Templates'),
    canActivate: [permissionGuard],
    data: {
      permissions: [PERMISSIONS.TMPL_ACCESS, PERMISSIONS.TMPL_SEARCH],
      operator: PERMISSION_OPERATOR.AND,
    },
  },
  {
    path: 'detail/:pid',
    component: DetailComponent,
    title: _('Template'),
    canActivate: [canAccessGuard],
    data: {
      action: CAN_ACCESS_ACTIONS.READ,
    },
  },
  {
    path: 'edit/:pid',
    component: EditorComponent,
    title: _('Template'),
    canActivate: [canAccessGuard],
    canDeactivate: [ComponentCanDeactivateGuard],
    data: {
      action: CAN_ACCESS_ACTIONS.UPDATE,
    },
  },
];

class TemplatesRoute extends BaseRoute implements RouteDataTypesInterface {

  private appStore = inject(AppStore);

  /** Route name */
  readonly name = 'templates';

  /** Record type */
  readonly recordType = 'templates';

  getTypes(): Partial<RecordType>[] {
    return [
      {
        key: this.name,
        label: _('Templates'),
        component: TemplatesBriefViewComponent,
        detailComponent: TemplateDetailViewComponent,
        searchFilters: [this.expertSearchFilter()],
        canAdd: () => this.routeToolService.canNot(),
        permissions: (record: RecordData) => this.routeToolService.permissions(record, this.recordType),
        canUse: (record: RecordData) => this._canUse(record),
        aggregationsOrder: ['type', 'visibility'],
        aggregationsExpand: ['type', 'visibility'],
        sortOptions: [
          {
            label: _('Relevance'),
            value: 'bestmatch',
            icon: 'fa fa-sort-amount-desc',
            defaultQuery: true,
          },
          {
            label: _('Name'),
            value: 'name',
            icon: 'fa fa-sort-alpha-asc',
            defaultNoQuery: true,
          },
        ],
        showFacetsIfNoResults: true,
      },
    ];
  }

  /**
   * Eval if a template can be used to create a new resource. If yes, set the url to use to create this resource.
   * @param record: the record to check
   * @return Observable providing object with 2 attributes :
   *   - 'can' - Boolean: to know if the resource could be used
   *   - 'message' - String: the message to display if the record cannot be used
   *   - 'url' - String: the url to use this template (optional)
   */
  private _canUse(record: any) {
    const usableTemplateTypes = ['documents', 'patrons'];
    return new Observable((observer: Subscriber<any>): void => {
      if (usableTemplateTypes.includes(record.metadata.template_type)) {
        this.routeToolService.canRead(record, this.recordType).subscribe((actionStatus: ActionStatus) => {
          if (actionStatus.can) {
            const urlTree = this.routeToolService.router.createUrlTree(
              ['/', 'records', record.metadata.template_type, 'new'],
              {
                queryParams: {
                  source: this.recordType,
                  pid: record.metadata.pid,
                },
              }
            );
            const url = this.routeToolService.urlSerializer.serialize(urlTree);
            actionStatus.url = url;
            observer.next(actionStatus);
          }
        });
      }
    });
  }
}
