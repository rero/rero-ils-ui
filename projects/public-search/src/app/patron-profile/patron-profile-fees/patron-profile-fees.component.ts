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
import { Component, inject, Input } from '@angular/core';
import { PatronProfileMenuStore } from '../store/patron-profile-menu-store';
import { FeesStore } from '../store/fees-store';

@Component({
  selector: 'public-search-patron-profile-fees',
  templateUrl: './patron-profile-fees.component.html',
  standalone: false
})
export class PatronProfileFeesComponent {

  private patronProfileMenuStore = inject(PatronProfileMenuStore);
  private feesStore = inject(FeesStore);

  /** Total of fees */
  @Input() feesTotal: number;

  /** requests records */
  records = this.feesStore.fees;

  /** loading state */
  loading = this.feesStore.feesLoading;

  get currency() {
    const patron = this.patronProfileMenuStore.currentPatron();
    return patron ? patron.organisation.currency : '';
  }
}
