/*
 * RERO ILS UI
 * Copyright (C) 2021 RERO
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
import { DetailRecord } from '@rero/ng-core/lib/record/detail/view/detail-record';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { RecordPermissions } from '@app/admin/classes/permissions';
import { RecordPermissionService } from '@app/admin/service/record-permission.service';
import { CurrentLibraryPermissionValidator } from '@app/admin/utils/permissions';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { AcqOrderApiService } from '@app/admin/acquisition/api/acq-order-api.service';
import { AcqOrderHistoryVersion, AcqOrderStatus, IAcqOrder, AcqOrderHistoryVersionResponseInterface } from '../../../classes/order';
import { PlaceOrderFormComponent } from '../place-order-form/place-order-form.component';

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

  /** modal reference */
  private _modalRef: BsModalRef;
  /** all component subscription */
  private _subscriptions = new Subscription();

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
   * @param _scroller - ViewportScroller
   * @param _modalService - BsModalService
   * @param _recordPermissionService - RecordPermissionService
   * @param _permissionValidator - CurrentLibraryPermissionValidator
   * @param _acqOrderService - AcqOrderApiService
   */
  constructor(
    private _scroller: ViewportScroller,
    private _modalService: BsModalService,
    private _recordPermissionService: RecordPermissionService,
    private _acqOrderService: AcqOrderApiService,
    private _permissionValidator: CurrentLibraryPermissionValidator
  ) { }

  /** OnInit hook */
  ngOnInit() {
    this._subscriptions.add(this.record$.subscribe(
      (record: any) => {
        this.order = record.metadata;
        if (this.order.is_current_budget) {
          this._subscriptions.add(this._recordPermissionService.getPermission('acq_orders', this.order.pid)
          .pipe(map((permissions) => this._permissionValidator.validate(permissions, this.order.library.pid)))
          .subscribe((permissions) => {
            this.recordPermissions = permissions;
            this.isPermissionsLoaded = true;
          }));
        } else {
          this.isPermissionsLoaded = true;
        }

        /* UPDATE 'EDIT' BUTTON
         *   if the related order has the PENDING status, then a new action 'place order' button should be
         *   added near the 'edit' button. This new button should be considered as the new primary button,
         *   then the edit button should loose this privilege.
         */
        setTimeout(() => {
          if (this.order.status === AcqOrderStatus.PENDING) {
            const button = document.getElementById('detail-edit-button');
            button.classList.remove('btn-primary');
            button.classList.add('btn-outline-primary');
          }
        });

        // Ask for order history
        this._acqOrderService.getOrderHistory(this.order.pid);
      }
    ));
    this._subscriptions.add(this._acqOrderService.acqOrderHistorySubject.subscribe(
      (versions: AcqOrderHistoryVersionResponseInterface[]) => {
        this.historyVersions = versions.map(version => new AcqOrderHistoryVersion(version));
      }));
  }

  /** OnDestroy hook */
  ngOnDestroy(): void {
      this._subscriptions.unsubscribe();
  }

  // COMPONENT FUNCTIONS =======================================================

  /** Scroll to an anchor
   *  @param e - the fired event
   *  @param anchorId - the anchor ID
   */
  scrollTo(e: Event, anchorId: string): void {
    e.preventDefault();
    this._scroller.scrollToAnchor(anchorId);
  }

  /**
   * Open a modal dialog to allow user to validate the order.
   * If the user submit the form (and submitting is success), then update the order to get the updated data.
   */
  placeOrderDialog() {
    this._modalRef = this._modalService.show(PlaceOrderFormComponent, {
      ignoreBackdropClick: true,
      keyboard: true,
      class: 'modal-lg',
      initialState: {
        order: this.order
      }
    });
    this._modalRef.content.onOrderSentEvent.subscribe((order: IAcqOrder) => {
      if (this.order.pid === order.pid) {
        this.order = order;
      }
    });
  }
}
