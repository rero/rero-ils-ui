// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { I18nPluralPipe, NgClass, NgTemplateOutlet } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ButtonModule } from '@openng/optimus-ui/button';
import { TagModule } from '@openng/optimus-ui/tag';
import { TooltipModule } from '@openng/optimus-ui/tooltip';
import { DateTranslatePipe } from '@rero/ng-core';
import { ArrayTranslatePipe, IOrganisation, JoinPipe, OpenCloseButtonComponent } from '@rero/shared';
import { DateTime } from 'luxon';

import { CanExtend } from '../../../api/loan-api.service';
import { PatronProfileDocumentComponent } from '../../patron-profile-document/patron-profile-document.component';
import { PatronProfileStore } from '../../store/patron-profile.store';

@Component({
  selector: 'public-search-patron-profile-loan',
  templateUrl: './patron-profile-loan.component.html',
  imports: [
    NgClass,
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
})
export class PatronProfileLoanComponent {
  protected readonly store = inject(PatronProfileStore);

  // COMPONENT ATTRIBUTES =====================================================
  /** Loan record */
  record = input<any>();

  /** Document section is collapsed */
  isCollapsed = true;
  /** Request in progress */
  readonly renewInProgress = computed(() => this.store.renewingLoanPid() === this.record()?.metadata.pid);
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
    return metadata?.is_late ? false : DateTime.fromISO(metadata?.due_soon_date) <= DateTime.now();
  }

  /** Get the cannot extend reasons messages as an array for template pipes */
  get reasons(): string[] {
    return Object.values(this.canExtend()?.reasons || {});
  }

  // COMPONENTS FUNCTIONS =====================================================
  /** Renew the current loan */
  renew(): void {
    this.store.renewLoan(this.record().metadata.pid);
  }
}
