// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { AsyncPipe } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { TagModule } from '@openng/optimus-ui/tag';
import { DateTranslatePipe, GetRecordPipe, RecordData } from '@rero/ng-core';
import { ContributionComponent } from '@rero/shared';

import { PatronProfileStore } from '../../store/patron-profile.store';

@Component({
  selector: 'public-search-patron-profile-history',
  templateUrl: './patron-profile-history.component.html',
  imports: [TranslatePipe, AsyncPipe, DateTranslatePipe, GetRecordPipe, ContributionComponent, TagModule],
})
export class PatronProfileHistoryComponent {
  private store = inject(PatronProfileStore);

  /** Loan record */
  record = input<RecordData>();

  /** Document section is collapsed */
  isCollapsed = true;

  /** Get current viewcode */
  get viewcode(): string {
    return this.store.currentPatron()?.organisation.code ?? '';
  }
}
