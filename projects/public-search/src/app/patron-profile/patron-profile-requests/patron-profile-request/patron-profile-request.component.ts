// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { NgClass, NgTemplateOutlet } from '@angular/common';
import { Component, inject, input, signal, ChangeDetectionStrategy} from '@angular/core';
import { TranslateDirective, TranslatePipe, TranslateService } from '@ngx-translate/core';
import { CONFIG, DateTranslatePipe, RecordData } from '@rero/ng-core';
import { OpenCloseButtonComponent } from '@rero/shared';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { LoanApiService } from '../../../api/loan-api.service';
import { PatronProfileStore } from '../../store/patron-profile.store';
import { PatronProfileDocumentComponent } from '../../patron-profile-document/patron-profile-document.component';

@Component({
    selector: 'public-search-patron-profile-request',
    templateUrl: './patron-profile-request.component.html',
    imports: [NgClass, NgTemplateOutlet, TranslateDirective, TranslatePipe, DateTranslatePipe, OpenCloseButtonComponent, ButtonModule, PatronProfileDocumentComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PatronProfileRequestComponent {

  private loanApiService = inject(LoanApiService);
  private translateService = inject(TranslateService);
  private store = inject(PatronProfileStore);
  private messageService = inject(MessageService);

  /** Request record */
  record = input<RecordData>();

  /** Document section is collapsed */
  isCollapsed = true;

  /** Renew action done */
  readonly actionDone = signal(false);

  /** Cancel action success */
  readonly actionSuccess = signal(false);

  /** Cancel in progress */
  readonly cancelInProgress = signal(false);

  /** Get current viewcode */
  get viewcode(): string {
    return this.store.currentPatron()?.organisation.code ?? '';
  }

  /** Cancel a request */
  cancel(): void {
    const patronPid = this.store.currentPatron()!.pid;
    this.cancelInProgress.set(true);
    const metadata = this.record()?.metadata as any;
    this.loanApiService.cancel({
      pid: metadata?.pid,
      transaction_location_pid: metadata?.item.location.pid,
      transaction_user_pid: patronPid
    }).subscribe((cancelLoan: any) => {
      if (cancelLoan !== undefined) {
        this.store.cancelRequest(metadata?.pid);
        this.actionDone.set(true);
        this.messageService.add({
          severity: 'success',
          summary: this.translateService.instant('Success'),
          detail: this.translateService.instant('The request has been cancelled.'),
          life: CONFIG.MESSAGE_LIFE
        });
      } else {
        this.cancelInProgress.set(false);
        this.messageService.add({
          severity: 'error',
          summary: this.translateService.instant('Error'),
          detail: this.translateService.instant('Error during the cancellation of the request.'),
          closable: true
        });
      }
    });
  }
}
