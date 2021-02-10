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
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { Error, Record } from '@rero/ng-core';
import { Paginator } from '@rero/shared';
import { Observable, Subscription } from 'rxjs';
import { PatronTransactionApiService } from '../../api/patron-transaction-api.service';
import { UserService } from '../../user.service';
import { ITabEvent, PatronProfileService } from '../patron-profile.service';

@Component({
  selector: 'public-search-patron-profile-fees',
  templateUrl: './patron-profile-fees.component.html'
})
export class PatronProfileFeesComponent implements OnInit, OnDestroy {

  /** Total of fees */
  @Input() feesTotal: number;

  /** First call of get record */
  loaded = false;

  /** requests records */
  records = [];

  /** Records paginator */
  private _paginator: Paginator;

  /** Observable subscription */
  private _subscription = new Subscription();

  /** Get paginator */
  get paginator(): Paginator {
    return this._paginator;
  }

  /** Get current logged user */
  get user() {
    return this._userService.user;
  }

  /**
   * Constuctor
   * @param _patronTransactionApiService - PatronTransactionApiService
   * @param _userService - UserService
   * @param _patronProfileService - PatronProfileService
   */
  constructor(
    private _patronTransactionApiService: PatronTransactionApiService,
    private _userService: UserService,
    private _patronProfileService: PatronProfileService
  ) {}

  /** OnInit hook */
  ngOnInit(): void {
    this._paginator = new Paginator();
    this._paginator
      .setHiddenInfo(
        _('({{ count }} hidden fee)'),
        _('({{ count }} hidden fees)')
      );
    this._subscription.add(
      this._paginator.more$.subscribe((page: number) => {
        this._queryFee(page).subscribe((response: Record) => {
          this.records = this.records.concat(response.hits.hits);
        });
      })
    );
    this._subscription.add(
      this._patronProfileService.tabsEvent$.subscribe((event: ITabEvent) => {
        if (event.name === 'fee') {
          if (event.count === 0) {
            this.loaded = true;
          } else {
            this._queryFee(1).subscribe((response: Record) => {
              this._paginator.setRecordsCount(response.hits.total.value);
              this.records = response.hits.hits;
              this.loaded = true;
            });
          }
        }
      })
    );
  }

  /** OnDestroy hook */
  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  /**
   * Query fee
   * @param page - number
   * @param status - string
   * @return Observable
   */
  private _queryFee(page: number, status: string = 'open'): Observable<Record | Error> {
    return this._patronTransactionApiService
      .getFees(this.user.pid, status, page, this._paginator.getRecordsPerPage());
  }
}
