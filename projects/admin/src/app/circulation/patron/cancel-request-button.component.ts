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
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { LoanService } from '@app/admin/service/loan.service';
import { TranslateService } from '@ngx-translate/core';
import { CONFIG } from '@rero/ng-core';
import { UserService } from '@rero/shared';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'admin-cancel-request-button',
    template: `
    <p-button
      class="ui:pointer-events-auto"
      icon="fa fa-trash"
      severity="danger"
      outlined
      [pTooltip]="'The request cannot be cancelled'|translate"
      tooltipPosition="top"
      [disabled]="!canCancelRequest()"
      [tooltipDisabled]="canCancelRequest()"
      (onClick)="showCancelRequestDialog($event)"
    />
  `,
    standalone: false
})
export class CancelRequestButtonComponent {

  loanService: LoanService = inject(LoanService);
  userService: UserService = inject(UserService);
  translateService: TranslateService = inject(TranslateService);
  messageService: MessageService = inject(MessageService);

  /** Loan record */
  @Input() loan: any;

  /** Informs parent component to remove request when it is cancelled */
  @Output() cancelRequestEvent = new EventEmitter<any>();

  /**
   * Can cancel a loan request
   * @returns true if it is possible to cancel a loan
   */
  canCancelRequest(): boolean {
    return this.loanService.canCancelRequest(this.loan);
  }

  /** Show a confirmation dialog box for cancel request. */
  showCancelRequestDialog(event: Event): void {
    this.loanService.cancelRequestDialog(event, () => {
      this.loanService.cancelLoan(
        this.loan.metadata.item.pid,
        this.loan.metadata.pid,
        this.userService.user.currentLibrary
      ).subscribe((item: any) => {
        let message = this.translateService.instant("The request has been cancelled.");
        if (item?.pending_loans?.length > 0) {
          message += "<br>";
          message += this.translateService.instant("The item contains requests.");
        }
        this.messageService.add({
          severity: 'warn',
          summary: this.translateService.instant('Request'),
          detail: message,
          life: CONFIG.MESSAGE_LIFE
        });
        this.cancelRequestEvent.emit(this.loan.id);
      });
    });
  }
}
