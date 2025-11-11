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
import { Component, inject, OnInit } from '@angular/core';
import { LoansStore } from '../store/loans-store';

@Component({
  selector: 'public-search-patron-profile-loans',
  templateUrl: './patron-profile-loans.component.html',
  standalone: false,
  providers: [LoansStore]
})
export class PatronProfileLoansComponent implements OnInit {

  /** data is loaded */
  protected store = inject(LoansStore);

  /** sort criteria */
  sortCriteria = 'duedate';

  /** OnInit hook */
  ngOnInit(): void {
    this.store.loadLoans(this.sortCriteria);
  }

  selectionChange(value) {
    this.sortCriteria = value;
    this.store.loadLoans(this.sortCriteria);

  }
}
