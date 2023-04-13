/*
 * RERO ILS UI
 * Copyright (C) 2023 RERO
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

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LoanService } from '@app/admin/service/loan.service';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '@rero/shared';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'admin-cancel-request-button',
  template: `
  <ng-container *ngIf="canCancelRequest(); else noCancel">
    <button type="button"
            class="btn btn-outline-danger btn-sm"
            (click)="showCancelRequestDialog()"
            name="cancel">
      <i class="fa fa-trash-o" aria-hidden="true"></i>
    </button>
  </ng-container>
  <ng-template #noCancel>
    <button type="button" class="btn btn-outline-danger btn-sm"
            title="{{'The request cannot be cancelled' | translate }}"
            name="cancel"
            disabled>
      <i class="fa fa-trash-o" aria-hidden="true"></i>
    </button>
  </ng-template>
  `
})
export class CancelRequestButtonComponent {

  /** Loan record */
  @Input() loan: any;

  /** Informs parent component to remove request when it is cancelled */
  @Output() cancelRequestEvent = new EventEmitter<any>();

  /**
   * Constructor
   * @param _loanService - LoanService
   * @param _userService - UserService
   * @param _translateService - TranslateService
   * @param _toastrService - ToastrService
   */
  public constructor(
    private _loanService: LoanService,
    private _userService: UserService,
    private _translateService: TranslateService,
    private _toastrService: ToastrService
  ) {}

  /**
   * Can cancel a loan request
   * @returns true if it is possible to cancel a loan
   */
  canCancelRequest(): boolean {
    return this._loanService.canCancelRequest(this.loan);
  }

  /** Show a confirmation dialog box for cancel request. */
  showCancelRequestDialog(): void {
    this._loanService.cancelRequestDialog().subscribe((confirm: boolean) => {
      if (confirm) {
        this._loanService.cancelLoan(
          this.loan.metadata.item.pid,
          this.loan.metadata.pid,
          this._userService.user.currentLibrary
        ).subscribe(() => {
          this._toastrService.warning(
            this._translateService.instant('The request has been cancelled.'),
            this._translateService.instant('Request')
          );
          this.cancelRequestEvent.emit(this.loan.id);
        });
      }
    });
  }
}
