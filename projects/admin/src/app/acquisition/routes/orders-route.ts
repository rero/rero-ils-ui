// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
import { inject } from '@angular/core';
import { ResolveFn, Routes } from '@angular/router';
import { _ } from '@ngx-translate/core';
import {
  ComponentCanDeactivateGuard,
  DetailComponent,
  EditorComponent,
  IFilter,
  RecordData,
  RecordSearchPageComponent,
  RecordService,
  RecordType,
  RouteDataTypesInterface,
} from '@rero/ng-core';
import { PERMISSIONS, PERMISSION_OPERATOR } from '@rero/shared';
import { Observable, map, of } from 'rxjs';
import { acqOrderLineGuard } from '../../guard/acq-order-line.guard';
import { CAN_ACCESS_ACTIONS, canAccessGuard } from '../../guard/can-access.guard';
import { permissionGuard } from '../../guard/permission.guard';
import { BaseRoute } from '../../routes/base-route';
import { OrderBriefViewComponent } from '../components/order/order-brief-view/order-brief-view.component';
import { OrderDetailViewComponent } from '../components/order/order-detail-view/order-detail-view.component';
import { OrderReceiptViewComponent } from '../components/receipt/receipt-form/order-receipt-view.component';
import { canOrderReceiptGuard } from './guards/can-order-receipt.guard';

export const ordersRouteResolver: ResolveFn<Partial<RecordType>[]> = () =>
  new OrdersRoute().getTypes();

export const ordersRoutes: Routes = [
  {
    path: '',
    component: RecordSearchPageComponent,
    title: _('Orders'),
    canActivate: [permissionGuard],
    data: {
      permissions: [PERMISSIONS.ACOR_ACCESS, PERMISSIONS.ACOR_SEARCH],
      operator: PERMISSION_OPERATOR.AND,
    },
  },
  {
    path: 'detail/:pid',
    component: DetailComponent,
    title: _('Order'),
    canActivate: [canAccessGuard],
    data: {
      action: CAN_ACCESS_ACTIONS.READ,
    },
  },
  {
    path: 'edit/:pid',
    component: EditorComponent,
    title: _('Order'),
    canActivate: [canAccessGuard, acqOrderLineGuard],
    canDeactivate: [ComponentCanDeactivateGuard],
    data: {
      action: CAN_ACCESS_ACTIONS.UPDATE,
      permissions: [PERMISSIONS.ACOR_SEARCH],
    },
  },
  {
    path: 'new',
    component: EditorComponent,
    title: _('Order'),
    canActivate: [permissionGuard],
    canDeactivate: [ComponentCanDeactivateGuard],
    data: {
      permissions: [PERMISSIONS.ACOR_CREATE],
    },
  },
  {
    path: 'receive/:pid',
    component: OrderReceiptViewComponent,
    title: _('Order'),
    canActivate: [canOrderReceiptGuard],
  },
];

class OrdersRoute extends BaseRoute implements RouteDataTypesInterface {
  protected recordService = inject(RecordService);

  /** Route name */
  readonly name = 'acq_orders';
  /** Record type */
  readonly recordType = 'acq_orders';

  getTypes(): Partial<RecordType>[] {
    const orderType: any = {
      key: this.name,
      label: _('Orders'),
      component: OrderBriefViewComponent,
      detailComponent: OrderDetailViewComponent,
      searchFilters: [this.expertSearchFilter()],
      canAdd: () => of({ can: this.routeToolService.appStore.canAccess(PERMISSIONS.ACOR_CREATE), message: '' }),
      permissions: (record: RecordData) => this.routeToolService.permissions(record, this.recordType, true),
      processFilterName: (filter: IFilter) => this.processFilterName(filter),
      preCreateRecord: (data: any) => this._addDefaultInformation(data),
      preUpdateRecord: (data: any) => this._cleanRecord(data),
      aggregationsExpand: ['library', 'order_date', 'status'],
      aggregationsOrder: ['budget', 'library', 'status', 'account', 'vendor', 'order_date', 'receipt_date'],
      aggregationsBucketSize: 10,
      itemHeaders: {
        Accept: 'application/rero+json, application/json',
      },
      listHeaders: {
        Accept: 'application/rero+json',
      },
      sortOptions: [
        {
          label: _('Relevance'),
          value: 'bestmatch',
          defaultQuery: true,
          icon: 'fa-solid fa-arrow-down-wide-short',
        },
        {
          label: _('Receipt date (newest)'),
          value: 'receipt_date',
          icon: 'fa-solid fa-arrow-down-wide-short',
        },
        {
          label: _('Reference (asc)'),
          value: 'reference_asc',
          icon: 'fa-solid fa-arrow-down-a-z',
        },
        {
          label: _('Reference (desc)'),
          value: 'reference_desc',
          icon: 'fa-solid fa-arrow-down-z-a',
        },
        {
          label: _('Order date (newest)'),
          value: 'order_date_new',
          icon: 'fa-solid fa-arrow-down-wide-short',
        },
        {
          label: _('Order date (oldest)'),
          value: 'order_date_old',
          icon: 'fa-solid fa-arrow-down-short-wide',
        },
      ],
      exportFormats: [
        {
          label: 'CSV',
          format: 'csv',
          endpoint: this.routeToolService.apiService.getExportEndpointByType(this.recordType),
          disableMaxRestResultsSize: true,
        },
      ],
    };
    return [orderType];
  }

  /**
   * Add default informations to an account record before creating it.
   * @param data: the data to improve
   * @return: the enrich data
   */
  private _addDefaultInformation(data: any): any {
    data.organisation = {
      $ref: this.routeToolService.apiService.getRefEndpoint('organisations', this.routeToolService.appStore.currentOrganisationPid()),
    };
    data.library = {
      $ref: this.routeToolService.apiService.getRefEndpoint('libraries', this.routeToolService.appStore.currentLibraryPid()),
    };
    return data;
  }

  /**
   * Remove some fields from model. These field are added to record during
   * dumping but are not present into the `Order` JSON schema.
   * @param data: the data to update
   * @return: the cleaned data
   */
  private _cleanRecord(data: any): any {
    // remove dynamic fields
    const fieldsToRemoved = ['is_current_budget', 'status', 'account_statement'];
    return this.fieldsToRemoved(data, fieldsToRemoved);
  }

  private processFilterName(filter: IFilter): Observable<string> {
    if(filter.name) { return of(filter.name); }
    switch (filter.aggregationKey) {
      case 'budget': return this.recordService.getRecord<{metadata: {name: string}}>('budgets', filter.key).pipe(map(record => record.metadata.name));
      case 'account': return this.recordService.getRecord<{metadata: {name: string}}>('acq_accounts', filter.key).pipe(map(record => record.metadata.name));
      case 'library': return this.recordService.getRecord<{metadata: {name: string}}>('libraries', filter.key).pipe(map(record => record.metadata.name));
      case 'vendor': return this.recordService.getRecord<{metadata: {name: string}}>('vendors', filter.key).pipe(map(record => record.metadata.name));
      default: return this.routeToolService.translateService.stream(filter.key);
    }
  }
}
