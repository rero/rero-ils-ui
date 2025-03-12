/*
 * RERO ILS UI
 * Copyright (C) 2021-2024 RERO
 * Copyright (C) 2021 UCLouvain
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
import { APP_BASE_HREF, Location, ViewportScroller } from '@angular/common';
import { Component, inject, model, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AcqOrderApiService } from '@app/admin/acquisition/api/acq-order-api.service';
import { AcqReceiptApiService } from '@app/admin/acquisition/api/acq-receipt-api.service';
import { RecordPermissions } from '@app/admin/classes/permissions';
import { RecordPermissionService } from '@app/admin/service/record-permission.service';
import { CurrentLibraryPermissionValidator } from '@app/admin/utils/permissions';
import { TranslateService } from '@ngx-translate/core';
import { extractIdOnRef } from '@rero/ng-core';
import { DetailRecord } from '@rero/ng-core/lib/record/detail/view/detail-record';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import {
  AcqOrderHistoryVersion,
  AcqOrderStatus,
  IAcqOrder
} from '../../../classes/order';
import { OrderEmailFormComponent } from '../order-email-form/order-email-form.component';

@Component({
    selector: 'admin-acquisition-order-detail-view',
    templateUrl: './order-detail-view.component.html',
    standalone: false
})
export class OrderDetailViewComponent implements DetailRecord, OnInit, OnDestroy {
  private dialogService: DialogService = inject(DialogService);
  private scroller: ViewportScroller = inject(ViewportScroller);
  private recordPermissionService: RecordPermissionService = inject(RecordPermissionService);
  private acqOrderService: AcqOrderApiService = inject(AcqOrderApiService);
  private permissionValidator: CurrentLibraryPermissionValidator = inject(CurrentLibraryPermissionValidator);
  private translateService: TranslateService = inject(TranslateService);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private location: Location = inject(Location);
  private baseHref = inject(APP_BASE_HREF);
  private acqReceiptApiService: AcqReceiptApiService = inject(AcqReceiptApiService);

  // COMPONENT ATTRIBUTES =====================================================
  /** Observable resolving record data */
  record$: Observable<any>;
  /** Resource type */
  type: string;
  /** the order corresponding to the record */
  order: IAcqOrder;
  /** Is order notes are collapsed */
  notesCollapsed = true;
  /** reference to AcqOrderStatus class */
  acqOrderStatus = AcqOrderStatus;
  /** order permissions */
  recordPermissions?: RecordPermissions;

  /** history versions of this order */
  historyVersions: AcqOrderHistoryVersion[] = [];

  /** all component subscription */
  private subscriptions = new Subscription();

  modalRef: DynamicDialogRef | undefined;

  tabActiveIndex = model<undefined | string >(undefined);

  // GETTER & SETTER ==========================================================
  /** Determine if the order could be "placed/ordered" */
  get canPlaceOrder(): boolean {
    return this.order.status === AcqOrderStatus.PENDING && this.order.account_statement.provisional.total_amount > 0;
  }

  get canAddLine(): boolean {
    return this.order.status === AcqOrderStatus.PENDING;
  }

  /** Is this order could manage reception */
  get disabledReceipts(): boolean {
    return [AcqOrderStatus.PENDING, AcqOrderStatus.CANCELLED].some((status) => status === this.order.status);
  }

  get createInfoMessage(): string {
    return this.recordPermissionService.generateTooltipMessage(this.recordPermissions.create.reasons);
  }

  addTabToUrl(event) {
    this.location.replaceState(location.pathname.replace(this.baseHref, ''), `tab=${event}`);
  }

  /** OnInit hook */
  ngOnInit(): void {
    this.tabActiveIndex.set(this.route.snapshot.queryParamMap.get('tab') || 'order');
    this.subscriptions.add(this.tabActiveIndex.subscribe(tabName => this.addTabToUrl(tabName)));
    this.subscriptions.add(
      this.record$.pipe(
        tap((record: any) => this.order = record.metadata),
        switchMap(() => {
          const obs = [
            // history
            this.acqOrderService.getOrderHistory(this.order.pid).pipe(
              map((versions) => this.historyVersions = versions.map((version) => new AcqOrderHistoryVersion(version)))
            ),
            // permissions
            this.recordPermissionService.getPermission('acq_orders', this.order.pid).pipe(
              map((permissions) => this.permissionValidator.validate(permissions, this.order.library.pid)),
              map((permissions) => this.recordPermissions = permissions)
            )
          ];
          return forkJoin(obs);
        }),
        switchMap(() =>
          // reload order if an order line has been deleted
          this.acqReceiptApiService.deletedReceiptSubject$
        ),
        switchMap(() => this.acqOrderService.getOrder(this.order.pid, 1)),
        tap(order => this.order = order)
      ).subscribe()
    );
  }

  /** OnDestroy hook */
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  // COMPONENT FUNCTIONS =======================================================

  /** Scroll to an anchor
   *  @param e - the fired event
   *  @param anchorId - the anchor ID
   */
  scrollTo(e: Event, anchorId: string): void {
    e.preventDefault();
    this.scroller.scrollToAnchor(anchorId);
  }

  /**
   * Open a modal dialog to allow user to validate the order.
   * If the user submit the form (and submitting is success), then update the order to get the updated data.
   */
  placeOrderDialog(): void {
    this.modalRef = this.dialogService.open(OrderEmailFormComponent, {
      header: this.translateService.instant('Place order'),
      width: '60vw',
      dismissableMask: true,
      closable: true,
      data: {
        order: this.order,
      },
    });
    this.modalRef.onClose.subscribe((order?: IAcqOrder) => {
      if (order && this.order.pid === order.pid) {
        if (order.vendor.$ref) {
          order.vendor.pid = extractIdOnRef(order.vendor.$ref);
        }
        this.order = order;
      }
    });
  }
}
