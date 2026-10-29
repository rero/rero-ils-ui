// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Component, inject, input, output } from '@angular/core';
import { LoanService } from '@app/admin/service/loan.service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ConfirmationService, MessageService } from '@openng/optimus-ui/api';
import { Bind } from '@openng/optimus-ui/bind';
import { Button } from '@openng/optimus-ui/button';
import { ConfirmDialog } from '@openng/optimus-ui/confirmdialog';
import { TooltipModule } from '@openng/optimus-ui/tooltip';
import { CONFIG } from '@rero/ng-core';
import { AppStore } from '@rero/shared';

@Component({
  selector: 'admin-cancel-request-button',
  template: `
    <p-confirmDialog />
    <p-button
      class="ui:pointer-events-auto"
      icon="fa-solid fa-trash-can"
      severity="danger"
      outlined
      [pTooltip]="'The request cannot be cancelled' | translate"
      tooltipPosition="top"
      [disabled]="!canCancelRequest()"
      [tooltipDisabled]="canCancelRequest()"
      (onClick)="showCancelRequestDialog()" />
  `,
  providers: [ConfirmationService],
  imports: [Bind, Button, ConfirmDialog, TranslatePipe, TooltipModule],
})
export class CancelRequestButtonComponent {
  private loanService = inject(LoanService);
  private appStore = inject(AppStore);
  private translateService = inject(TranslateService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  loan = input<any>();
  cancelRequestEvent = output<any>();

  canCancelRequest(): boolean {
    return this.loanService.canCancelRequest(this.loan());
  }

  showCancelRequestDialog(): void {
    this.confirmationService.confirm({
      header: this.translateService.instant('Cancel request'),
      message: this.translateService.instant('Do you really want to cancel the request?'),
      acceptLabel: this.translateService.instant('Yes'),
      rejectLabel: this.translateService.instant('No'),
      icon: 'fa-solid fa-triangle-exclamation fa-2x core:text-red-500',
      acceptButtonStyleClass: 'core:bg-red-500 core:border-red-500',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.loanService
          .cancelLoan(this.loan().metadata.item.pid, this.loan().metadata.pid, this.appStore.currentLibraryPid())
          .subscribe((item: any) => {
            let message = this.translateService.instant('The request has been cancelled.');
            if (item?.pending_loans?.length > 0) {
              message += '<br>' + this.translateService.instant('The item contains requests.');
            }
            this.messageService.add({
              severity: 'warn',
              summary: this.translateService.instant('Request'),
              detail: message,
              life: CONFIG.MESSAGE_LIFE,
            });
            this.cancelRequestEvent.emit(this.loan().id);
          });
      },
    });
  }
}
