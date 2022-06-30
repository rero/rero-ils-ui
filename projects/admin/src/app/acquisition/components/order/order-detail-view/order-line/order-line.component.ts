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
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { RecordService } from '@rero/ng-core';
import { RecordPermissions } from 'projects/admin/src/app/classes/permissions';
import { RecordPermissionService } from 'projects/admin/src/app/service/record-permission.service';
import { CurrentLibraryPermissionValidator } from 'projects/admin/src/app/utils/permissions';
import { forkJoin, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { AcqOrderApiService } from '../../../../api/acq-order-api.service';
import { AcqOrderLineStatus, IAcqOrderLine } from '../../../../classes/order';


@Component({
  selector: 'admin-order-line',
  templateUrl: './order-line.component.html',
  styleUrls: ['../../../../acquisition.scss', './order-line.component.scss']
})
export class OrderLineComponent implements OnInit, OnDestroy {

  // COMPONENT ATTRIBUTES =====================================================
  /** order line */
  @Input() orderLine: IAcqOrderLine;
  /** parent order */
  @Input() order: any;
  /** order line permission */
  @Input() permissions?: RecordPermissions;

  /** order line relate account */
  account: any;
  /** Is the line is collapsed */
  isCollapsed = true;
  /** reference to AcqOrderLineStatus */
  orderLineStatus = AcqOrderLineStatus;

  /** all component subscription */
  private _subscriptions = new Subscription();

  // GETTER & SETTER ==========================================================
  /**
   * Get a message containing the reasons why the order line cannot be deleted
   * @return the message to display into the tooltip box
   */
  get deleteInfoMessage(): string {
    return (!this.permissions.delete.can)
      ? this._recordPermissionService.generateDeleteMessage(this.permissions.delete.reasons)
      : null;
  }
  get editInfoMessage(): string {
    return (!this.permissions.update.can)
      ? this._recordPermissionService.generateTooltipMessage(this.permissions.update.reasons, 'update')
      : null;
  }

  // CONSTRUCTOR & HOOKS ======================================================
  /** Constructor
   * @param _recordPermissionService - RecordPermissionService
   * @param _recordService - RecordService
   * @param _acqOrderApiService - AcqOrderApiService
   * @param _permissionValidator - CurrentLibraryPermissionValidator
   */
  constructor(
    private _recordPermissionService: RecordPermissionService,
    private _recordService: RecordService,
    private _acqOrderApiService: AcqOrderApiService,
    private _permissionValidator: CurrentLibraryPermissionValidator
  ) { }

  /** OnInit hook */
  ngOnInit() {
    const account$ = this._recordService.getRecord('acq_accounts', this.orderLine.acq_account.pid);
    if (this.permissions) {
      const permissions$ = this._recordPermissionService.getPermission('acq_order_lines', this.orderLine.pid).pipe(
        map((permissions) => this._permissionValidator.validate(permissions, this.order.library.pid))
      );
      forkJoin([permissions$, account$]).subscribe(
        ([permissions, account]) => {
          this.permissions = permissions;
          this.account = account;
        }
      );
    } else {
      this._subscriptions.add(account$.subscribe(account => this.account = account));
    }
  }

  /** onDestroy hook */
  ngOnDestroy(): void {
    this._subscriptions.unsubscribe();
  }

  // COMPONENT FUNCTIONS ======================================================
  /** Delete the order line */
  deleteOrderLine() {
    this._acqOrderApiService.deleteOrderLine(this.orderLine);
  }
}
