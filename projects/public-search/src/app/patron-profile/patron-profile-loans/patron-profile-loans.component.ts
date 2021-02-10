/*
 * RERO ILS UI
 * Copyright (C) 2021 RERO
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
import { Component, OnDestroy, OnInit } from '@angular/core';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { Error, Record } from '@rero/ng-core';
import { Paginator } from '@rero/shared';
import { Observable, Subscription } from 'rxjs';
import { LoanApiService } from '../../api/loan-api.service';
import { UserService } from '../../user.service';

@Component({
  selector: 'public-search-patron-profile-loans',
  templateUrl: './patron-profile-loans.component.html'
})
export class PatronProfileLoansComponent implements OnInit, OnDestroy {

  /** Observable subscription */
  private _subscription = new Subscription();

  /** First get record */
  loaded = false;

  /** loans records */
  records = [];

  /** Records paginator */
  private _paginator: Paginator;

  /** Get paginator */
  get paginator(): Paginator {
    return this._paginator;
  }

  /**
   * Constructor
   * @param _loanApiService - LoanApiService
   * @param _userService - UserService
   */
  constructor(
    private _loanApiService: LoanApiService,
    private _userService: UserService
  ) {}

  /** OnInit hook */
  ngOnInit(): void {
    this._paginator = new Paginator();
    this._paginator
      .setHiddenInfo(
        _('({{ count }} hidden loan)'),
        _('({{ count }} hidden loans)')
      );
    this._subscription.add(
      this._paginator.more$.subscribe((page: number) => {
        this._loanQuery(page).subscribe((response: Record) => {
          this.records = this.records.concat(response.hits.hits);
        });
      })
    );
    this._loanQuery(1).subscribe((response: Record) => {
      this._paginator.setRecordsCount(response.hits.total.value);
      this.records = response.hits.hits;
      this.loaded = true;
    });
  }

  /** OnDestroy hook */
  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  /**
   * Loan query
   * @param page - number
   * @return Observable
   */
  private _loanQuery(page: number): Observable<Record | Error> {
    return this._loanApiService
      .getOnLoan(this._userService.user.pid, page, this._paginator.getRecordsPerPage());
  }
}
