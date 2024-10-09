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
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { Error, Record } from '@rero/ng-core';
import { Paginator } from '@rero/shared';
import { Observable, Subscription } from 'rxjs';
import { LoanApiService } from '../../api/loan-api.service';
import { PatronProfileMenuService } from '../patron-profile-menu.service';

@Component({
  selector: 'public-search-patron-profile-loans',
  templateUrl: './patron-profile-loans.component.html'
})
export class PatronProfileLoansComponent implements OnInit, OnDestroy {

  private loanApiService: LoanApiService = inject(LoanApiService);
  private patronProfileMenuService: PatronProfileMenuService = inject(PatronProfileMenuService);

  /** Observable subscription */
  private _subscription = new Subscription();

  /** First get record */
  loaded = false;

  /** loans records */
  records = [];

  /** sort criteria */
  sortCriteria = 'duedate';

  /** paginator page */
  page = 1;

  /** number of records per paginator page */
  nRecords = 20;

  /** Records paginator */
  paginator: Paginator;

  /** OnInit hook */
  ngOnInit(): void {
    this._initializePaginatorAndSubscription();
    this._initialLoad();
  }

  /** OnDestroy hook */
  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  /** Initialize paginator and subscription */
  private _initializePaginatorAndSubscription(): void {
    this.paginator = new Paginator();
    this.paginator
      .setRecordsPerPage(this.nRecords)
      .setHiddenInfo(
        _('({{ count }} hidden loan)'),
        _('({{ count }} hidden loans)')
      );

    this._subscription = new Subscription();
    this._subscription.add(
      this.paginator.more$.subscribe((page: number) => {
        this._loanQuery(page).subscribe((response: Record) => {
          this.records = this.records.concat(response.hits.hits);
          this.page = page;
        });
      })
    );
    this._subscription.add(
      this.patronProfileMenuService.onChange$.subscribe(() => {
        this._resetPaginator();
      })
    );
  }

  /** Initial records load */
  private _initialLoad(): void {
    this._loanQuery(1).subscribe((response: Record) => {
      this.paginator.setRecordsCount(response.hits.total.value);
      this.records = response.hits.hits;
      this.loaded = true;
    });
  }

  /**
   * Loan query
   * @param page - number
   * @return Observable
   */
  private _loanQuery(page: number): Observable<Record | Error> {
    const patronPid = this.patronProfileMenuService.currentPatron.pid;
    return this.loanApiService
      .getOnLoan(patronPid, page, this.paginator.getRecordsPerPage(), undefined, this.sortCriteria);
  }

  /** Reset paginator when patron profile menu has changed */
  private _resetPaginator(){
    this._loanQuery(1).subscribe((response: Record) => {
      this.paginator
        .setPage(1)
        .setRecordsCount(response.hits.total.value);

      this.records = response.hits.hits;
      this.page = 1;
      this.loaded = true;
    });
  }

   /**
    * Allow to sort loans list using a sort criteria
    * @param sortCriteria: the sort criteria to use for sorting the list
    */
  selectingSortCriteria(sortCriteria: string) {
    this.sortCriteria = sortCriteria;
    this.paginator.setRecordsPerPage(this.page * this.nRecords);

    this._loanQuery(1).subscribe((response: Record) => {
      this.records = response.hits.hits;
      this.paginator.setRecordsPerPage(this.nRecords);
      this.loaded = true;
    });
  }

}
