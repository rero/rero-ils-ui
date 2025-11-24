/*
 * RERO ILS UI
 * Copyright (C) 2021-2025 RERO
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
import { Component, computed, inject, input } from '@angular/core';
import { DateTime } from 'luxon';
import { LoansStore } from '../../store/loans-store';

@Component({
  selector: 'public-search-patron-profile-loan',
  templateUrl: './patron-profile-loan.component.html',
  standalone: false
})
export class PatronProfileLoanComponent {

  protected store = inject(LoansStore);

  // COMPONENT ATTRIBUTES =====================================================
  /** Loan record */
  loan = input<any>();

  isDueSoon = computed(() => {
    return (this.loan().metadata.is_late)
      ? false
      : DateTime.fromISO(this.loan().metadata.due_soon_date) <= DateTime.now();
  });

  /** Document section is collapsed */
  isCollapsed = true;

}
