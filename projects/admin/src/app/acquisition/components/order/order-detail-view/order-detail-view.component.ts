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
import { Component, OnInit } from '@angular/core';
import { RecordService, RecordUiService } from '@rero/ng-core';
import { DetailRecord } from '@rero/ng-core/lib/record/detail/view/detail-record';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RecordPermissions } from 'projects/admin/src/app/classes/permissions';
import { RecordPermissionService } from 'projects/admin/src/app/service/record-permission.service';
import { CurrentLibraryPermissionValidator } from 'projects/admin/src/app/utils/permissions';
import { AcqOrder, AcqOrderStatus } from '../../../classes/order';
import { AcqNoteType } from '../../../classes/common';
import { PlaceOrderFormComponent } from '../place-order-form/place-order-form.component';

@Component({
  selector: 'admin-acquisition-order-detail-view',
  templateUrl: './order-detail-view.component.html',
  styleUrls: ['./order-detail-view.component.scss']
})
export class OrderDetailViewComponent implements OnInit, DetailRecord {

  // COMPONENT ATTRIBUTES =====================================================
  /** Observable resolving record data */
  record$: Observable<any>;
  /** Resource type */
  type: string;
  /** the order corresponding to the record */
  order: AcqOrder;
  /** Is order notes are collapsed */
  notesCollapsed = true;
  /** reference to AcqOrderStatus class */
  acqOrderStatus = AcqOrderStatus;
  /** order permissions */
  permissions: RecordPermissions;

  /** modal reference */
  private _modalRef: BsModalRef;

  // GETTER & SETTER ==========================================================
  /** Determine if the order could be "placed/ordered" */
  get canPlaceOrder(): boolean {
    return this.order.status === AcqOrderStatus.PENDING && this.order.total_amount > 0;
  }

  /** Is this order could manage reception */
  get canViewReceipts(): boolean {
    return this.order.status !== AcqOrderStatus.PENDING;
  }

  // CONSTRUCTOR & HOOKS ======================================================
  /** Constructor
   * @param _recordService - RecordService
   * @param _recordUiService - RecordUiService
   * @param _scroller - ViewportScroller
   * @param _modalService - BsModalService
   * @param _recordPermissionService - RecordPermissionService
   * @param _permissionValidator - CurrentLibraryPermissionValidator
   */
  constructor(
    private _recordService: RecordService,
    private _recordUiService: RecordUiService,
    private _scroller: ViewportScroller,
    private _modalService: BsModalService,
    private _recordPermissionService: RecordPermissionService,
    private _permissionValidator: CurrentLibraryPermissionValidator
  ) { }

  /** OnInit hook */
  ngOnInit() {
    this.record$.subscribe(
      (record: any) => {
        this.order = new AcqOrder(record.metadata);
        this._recordPermissionService.getPermission('acq_orders', this.order.pid)
          .pipe(map((permissions) => this._permissionValidator.validate(permissions, this.order.library.pid)))
          .subscribe((permissions) => this.permissions = permissions);

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
      }
    );
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
    this._modalRef.content.onOrderSentEvent.subscribe((order: AcqOrder) => {
      if (this.order.pid === order.pid) {
        this.order = order;
      }
    });
  }
}
