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
import { Error, Record } from '@rero/ng-core';
import { Observable } from 'rxjs';
import { LoanApiService } from '../../api/loan-api.service';
import { PatronProfileMenuService } from '../patron-profile-menu.service';

@Component({
    selector: 'public-search-patron-profile-loans',
    templateUrl: './patron-profile-loans.component.html',
    standalone: false
})
export class PatronProfileLoansComponent implements OnInit {

  private loanApiService: LoanApiService = inject(LoanApiService);
  private patronProfileMenuService: PatronProfileMenuService = inject(PatronProfileMenuService);


  /** First get record */
  loaded = false;

  /** loans records */
  records = [];

  /** sort criteria */
  sortCriteria = 'duedate';

  /** OnInit hook */
  ngOnInit(): void {
    this.selectingSortCriteria(this.sortCriteria);
  }

  /**
   * Loan query
   * @param page - number
   * @return Observable
   */
  private _loanQuery(): Observable<Record | Error> {
    const patronPid = this.patronProfileMenuService.currentPatron.pid;
    return this.loanApiService
      .getOnLoan(patronPid, 1, 9999, undefined, this.sortCriteria);
  }


   /**
    * Allow to sort loans list using a sort criteria
    * @param sortCriteria: the sort criteria to use for sorting the list
    */
  selectingSortCriteria(sortCriteria: string) {
    this.sortCriteria = sortCriteria;
   
    this._loanQuery().subscribe((response: Record) => {
      this.records = response.hits.hits;
      this.loaded = true;
    });
  }

}
