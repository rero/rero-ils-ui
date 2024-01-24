/*
 * RERO ILS UI
 * Copyright (C) 2023-2024 RERO
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
  @if (canCancelRequest()) {
    <button type="button"
            class="btn btn-outline-danger btn-sm"
            (click)="showCancelRequestDialog()"
            name="cancel">
      <i class="fa fa-trash-o" aria-hidden="true"></i>
    </button>
  } @else {
    <button type="button" class="btn btn-outline-danger btn-sm"
            title="{{'The request cannot be cancelled' | translate }}"
            name="cancel"
            disabled>
      <i class="fa fa-trash-o" aria-hidden="true"></i>
    </button>
  }
  `
})
export class CancelRequestButtonComponent {

  /** Loan record */
  @Input() loan: any;

  /** Informs parent component to remove request when it is cancelled */
  @Output() cancelRequestEvent = new EventEmitter<any>();

  /**
   * Constructor
   * @param loanService - LoanService
   * @param userService - UserService
   * @param translateService - TranslateService
   * @param toastrService - ToastrService
   */
  public constructor(
    private loanService: LoanService,
    private userService: UserService,
    private translateService: TranslateService,
    private toastrService: ToastrService
  ) {}

  /**
   * Can cancel a loan request
   * @returns true if it is possible to cancel a loan
   */
  canCancelRequest(): boolean {
    return this.loanService.canCancelRequest(this.loan);
  }

  /** Show a confirmation dialog box for cancel request. */
  showCancelRequestDialog(): void {
    this.loanService.cancelRequestDialog().subscribe((confirm: boolean) => {
      if (confirm) {
        this.loanService.cancelLoan(
          this.loan.metadata.item.pid,
          this.loan.metadata.pid,
          this.userService.user.currentLibrary
        ).subscribe(() => {
          this.toastrService.warning(
            this.translateService.instant('The request has been cancelled.'),
            this.translateService.instant('Request')
          );
          this.cancelRequestEvent.emit(this.loan.id);
        });
      }
    });
  }
}
