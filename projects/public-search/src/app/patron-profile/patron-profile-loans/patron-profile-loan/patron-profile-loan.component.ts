// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { I18nPluralPipe, NgClass, NgTemplateOutlet } from '@angular/common';
import { Component, computed, inject, input, signal, ChangeDetectionStrategy} from '@angular/core';
import { TranslateDirective, TranslatePipe, TranslateService } from '@ngx-translate/core';
import { CONFIG, DateTranslatePipe } from '@rero/ng-core';
import { ArrayTranslatePipe, IOrganisation, JoinPipe, OpenCloseButtonComponent } from '@rero/shared';
import { DateTime } from 'luxon';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { finalize } from 'rxjs/operators';
import { CanExtend } from '../../../api/loan-api.service';
import { PatronProfileStore } from '../../store/patron-profile.store';
import { PatronProfileDocumentComponent } from '../../patron-profile-document/patron-profile-document.component';

@Component({
    selector: 'public-search-patron-profile-loan',
    templateUrl: './patron-profile-loan.component.html',
    imports: [
      NgClass,
      TranslateDirective,
      TranslatePipe,
      DateTranslatePipe,
      I18nPluralPipe,
      ArrayTranslatePipe,
      JoinPipe,
      OpenCloseButtonComponent,
      ButtonModule,
      TagModule,
      TooltipModule,
      PatronProfileDocumentComponent,
      NgTemplateOutlet,
    ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PatronProfileLoanComponent {

  private translateService = inject(TranslateService);
  private store = inject(PatronProfileStore);
  private messageService = inject(MessageService);

  // COMPONENT ATTRIBUTES =====================================================
  /** Loan record */
  record = input<any>();

  /** Document section is collapsed */
  isCollapsed = true;
  /** Renew action done */
  readonly actionDone = signal(false);
  /** Renew action success */
  readonly actionSuccess = signal(false);
  /** Request in progress */
  readonly renewInProgress = signal(false);
  /** Loan can extend */
  readonly canExtend = computed<CanExtend>(() => this.record()?.canExtend ?? { can: false, reasons: {} });
  /** Fees */
  fees = 0;

  // GETTER & SETTER ==========================================================
  /** Get organisation for current patron */
  get organisation(): IOrganisation {
    return this.store.currentPatron()!.organisation;
  }

  /** Get current viewcode */
  get viewcode(): string {
    return this.store.currentPatron()!.organisation.code;
  }
  /** Check if the loan should be returned in very few days */
  get isDueSoon(): boolean {
    const metadata = this.record()?.metadata;
    return (metadata?.is_late)
      ? false
      : DateTime.fromISO(metadata?.due_soon_date) <= DateTime.now();
  }

    /** Get the cannot extend reasons messages as an array for template pipes */
  get reasons(): string[] {
    return Object.values(this.canExtend()?.reasons || {});
  }

  // COMPONENTS FUNCTIONS =====================================================
  /** Renew the current loan */
  renew(): void {
    this.renewInProgress.set(true);
    this.store.renewLoan(this.record().metadata.pid)
      .pipe(finalize(() => this.renewInProgress.set(false)))
      .subscribe((extendLoan: any) => {
      this.actionDone.set(true);
      if (extendLoan !== undefined) {
        this.actionSuccess.set(true);
        this.messageService.add({
          severity: 'success',
          summary: this.translateService.instant('Success'),
          detail: this.translateService.instant('The item has been renewed.'),
          life: CONFIG.MESSAGE_LIFE
        });
      } else {
        this.messageService.add({
          severity: 'error',
          summary: this.translateService.instant('Error'),
          detail: this.translateService.instant('Error during the renewal of the item.'),
          closable: true
        });
      }
    });
  }
}
