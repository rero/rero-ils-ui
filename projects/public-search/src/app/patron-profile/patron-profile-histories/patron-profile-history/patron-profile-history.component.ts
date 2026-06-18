// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { AsyncPipe } from '@angular/common';
import { Component, inject, input, ChangeDetectionStrategy} from '@angular/core';
import { TranslateDirective } from '@ngx-translate/core';
import { DateTranslatePipe, GetRecordPipe, RecordData } from '@rero/ng-core';
import { ContributionComponent } from '@rero/shared';
import { TagModule } from 'primeng/tag';
import { PatronProfileStore } from '../../store/patron-profile.store';

@Component({
    selector: 'public-search-patron-profile-history',
    templateUrl: './patron-profile-history.component.html',
    imports: [AsyncPipe, TranslateDirective, DateTranslatePipe, GetRecordPipe, ContributionComponent, TagModule],
  changeDetection: ChangeDetectionStrategy.OnPush
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
