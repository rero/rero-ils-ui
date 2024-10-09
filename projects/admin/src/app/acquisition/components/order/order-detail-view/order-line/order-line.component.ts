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
import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { RecordPermissions } from '@app/admin/classes/permissions';
import { RecordPermissionService } from '@app/admin/service/record-permission.service';
import { CurrentLibraryPermissionValidator } from '@app/admin/utils/permissions';
import { RecordService } from '@rero/ng-core';
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

  private recordPermissionService: RecordPermissionService = inject(RecordPermissionService);
  private recordService: RecordService = inject(RecordService);
  private acqOrderApiService: AcqOrderApiService = inject(AcqOrderApiService);
  private permissionValidator: CurrentLibraryPermissionValidator = inject(CurrentLibraryPermissionValidator);

  // COMPONENT ATTRIBUTES =====================================================
  /** order line */
  @Input() orderLine: IAcqOrderLine;
  /** parent order */
  @Input() order: any;
  /** order line permission */
  @Input() recordPermissions?: RecordPermissions;

  /** order line relate account */
  account: any;
  /** Is the line is collapsed */
  isCollapsed = true;
  /** reference to AcqOrderLineStatus */
  orderLineStatus = AcqOrderLineStatus;

  /** all component subscription */
  private subscriptions = new Subscription();

  // GETTER & SETTER ==========================================================
  /**
   * Get a message containing the reasons why the order line cannot be deleted
   * @return the message to display into the tooltip box
   */
  get deleteInfoMessage(): string {
    return (!this.recordPermissions.delete.can)
      ? this.recordPermissionService.generateDeleteMessage(this.recordPermissions.delete.reasons)
      : null;
  }
  get editInfoMessage(): string {
    return (!this.recordPermissions.update.can)
      ? this.recordPermissionService.generateTooltipMessage(this.recordPermissions.update.reasons, 'update')
      : null;
  }

  /** OnInit hook */
  ngOnInit() {
    const account$ = this.recordService.getRecord('acq_accounts', this.orderLine.acq_account.pid);
    if (this.recordPermissions) {
      const permissions$ = this.recordPermissionService.getPermission('acq_order_lines', this.orderLine.pid).pipe(
        map((permissions) => this.permissionValidator.validate(permissions, this.order.library.pid))
      );
      forkJoin([permissions$, account$]).subscribe(
        ([permissions, account]) => {
          this.recordPermissions = permissions;
          this.account = account;
        }
      );
    } else {
      this.subscriptions.add(account$.subscribe(account => this.account = account));
    }
  }

  /** onDestroy hook */
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  // COMPONENT FUNCTIONS ======================================================
  /** Delete the order line */
  deleteOrderLine() {
    this.acqOrderApiService.deleteOrderLine(this.orderLine);
  }
}
