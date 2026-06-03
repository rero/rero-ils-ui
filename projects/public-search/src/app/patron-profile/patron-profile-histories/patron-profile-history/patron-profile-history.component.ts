/*
 * RERO ILS UI
 * Copyright (C) 2021-2024 RERO
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
