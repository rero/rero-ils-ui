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
import { ViewportScroller } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AcqOrderApiService } from '@app/admin/acquisition/api/acq-order-api.service';
import { RecordPermissions } from '@app/admin/classes/permissions';
import { RecordPermissionService } from '@app/admin/service/record-permission.service';
import { CurrentLibraryPermissionValidator } from '@app/admin/utils/permissions';
import { DetailRecord } from '@rero/ng-core/lib/record/detail/view/detail-record';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { AcqOrderHistoryVersion, AcqOrderHistoryVersionResponseInterface, AcqOrderStatus, IAcqOrder } from '../../../classes/order';
import { OrderEmailFormComponent } from '../order-email-form/order-email-form.component';
import { extractIdOnRef } from '@rero/ng-core';

@Component({
  selector: 'admin-acquisition-order-detail-view',
  templateUrl: './order-detail-view.component.html',
  styleUrls: ['../../../acquisition.scss', './order-detail-view.component.scss']
})
export class OrderDetailViewComponent implements DetailRecord, OnInit, OnDestroy {

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
  /** Is permissions loaded */
  isPermissionsLoaded = false;
  /** history versions of this order */
  historyVersions: AcqOrderHistoryVersion[] = [];

  /** all component subscription */
  private subscriptions = new Subscription();

  // GETTER & SETTER ==========================================================
  /** Determine if the order could be "placed/ordered" */
  get canPlaceOrder(): boolean {
    return this.order.status === AcqOrderStatus.PENDING && this.order.account_statement.provisional.total_amount > 0;
  }

  /** Is this order could manage reception */
  get canViewReceipts(): boolean {
    return this.order.status !== AcqOrderStatus.PENDING;
  }

  // CONSTRUCTOR & HOOKS ======================================================
  /** Constructor
   * @param scroller - ViewportScroller
   * @param modalService - BsModalService
   * @param recordPermissionService - RecordPermissionService
   * @param permissionValidator - CurrentLibraryPermissionValidator
   * @param acqOrderService - AcqOrderApiService
   */
  constructor(
    private scroller: ViewportScroller,
    private modalService: BsModalService,
    private recordPermissionService: RecordPermissionService,
    private acqOrderService: AcqOrderApiService,
    private permissionValidator: CurrentLibraryPermissionValidator
  ) { }

  /** OnInit hook */
  ngOnInit() {
    this.subscriptions.add(this.record$.subscribe(
      (record: any) => {
        this.order = record.metadata;
        if (this.order.is_current_budget) {
          this.subscriptions.add(this.recordPermissionService.getPermission('acq_orders', this.order.pid)
          .pipe(map((permissions) => this.permissionValidator.validate(permissions, this.order.library.pid)))
          .subscribe((permissions) => {
            this.recordPermissions = permissions;
            this.isPermissionsLoaded = true;
          }));
        } else {
          this.isPermissionsLoaded = true;
        }

        // Ask for order history
        this.acqOrderService.getOrderHistory(this.order.pid);
      }
    ));
    this.subscriptions.add(this.acqOrderService.acqOrderHistorySubject.subscribe(
      (versions: AcqOrderHistoryVersionResponseInterface[]) => {
        this.historyVersions = versions.map(version => new AcqOrderHistoryVersion(version));
      }));
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
  placeOrderDialog() {
    const modalRef = this.modalService.show(OrderEmailFormComponent, {
      ignoreBackdropClick: true,
      keyboard: true,
      class: 'modal-xl',
      initialState: {
        order: this.order
      }
    });
    // Event to allow the closing of the dialog
    modalRef.content.closeDialog.subscribe((close: boolean) => modalRef.hide());
    modalRef.content.recordChange.subscribe((order: IAcqOrder) => {
      if (this.order.pid === order.pid) {
        if (order.vendor.$ref) {
          order.vendor.pid = extractIdOnRef(order.vendor.$ref);
        }
        this.order = order;
      }
    });
  }
}
