/*
 * RERO ILS UI
 * Copyright (C) 2021-2025 RERO
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

import { Component, inject, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';

import { AcqReceiptApiService } from '@app/admin/acquisition/api/acq-receipt-api.service';
import { IAcqReceipt, IAcqReceiptLine } from '@app/admin/acquisition/classes/receipt';
import { RecordPermissions } from '@app/admin/classes/permissions';
import { RecordPermissionService } from '@app/admin/service/record-permission.service';
import { CurrentLibraryPermissionValidator } from '@app/admin/utils/permissions';
import { map, of, switchMap } from 'rxjs';

@Component({
  selector: 'admin-receipt-line',
  standalone: false,
  templateUrl: './receipt-line.component.html',
})
export class ReceiptLineComponent {
  private recordPermissionService: RecordPermissionService = inject(RecordPermissionService);
  private currentLibraryPermissionValidator: CurrentLibraryPermissionValidator = inject(
    CurrentLibraryPermissionValidator
  );
  private acqReceiptApiService: AcqReceiptApiService = inject(AcqReceiptApiService);

  line = input<IAcqReceiptLine>();
  receipt = input<IAcqReceipt>();
  allowActions = input<boolean>();

  /** Record permissions */
  permissions = toSignal<RecordPermissions>(toObservable(this.line).pipe(switchMap(() => this.updatePermissions())));

  // GETTER & SETTER ==========================================================
  /**
   * Get a message containing the reasons why the order line cannot be deleted
   * @return the message to display into the tooltip box
   */
  get deleteInfoMessage(): string | null {
    if (this.permissions() == null) {
      return null;
    }
    if (!this.permissions().delete?.can) {
      return this.recordPermissionService.generateTooltipMessage(this.permissions().delete?.reasons, 'delete');
    }
  }

  updatePermissions() {
    if (this.line() == null || !this.allowActions()) {
      return of(null);
    }
    return this.recordPermissionService.getPermission('acq_receipt_lines', this.line().pid).pipe(
      map((permissions) => {
        this.currentLibraryPermissionValidator.validate(permissions, this.receipt().library.pid);
        return permissions;
      })
    );
  }

  /** Delete a receipt line */
  delete(): void {
    this.acqReceiptApiService.deleteReceiptLine(this.line());
  }
}
