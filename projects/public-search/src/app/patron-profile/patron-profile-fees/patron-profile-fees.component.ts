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
import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { Error, Record } from '@rero/ng-core';
import { Paginator } from '@rero/shared';
import { Observable, Subscription } from 'rxjs';
import { PatronTransactionApiService } from '../../api/patron-transaction-api.service';
import { PatronProfileMenuService } from '../patron-profile-menu.service';
import { ITabEvent, PatronProfileService } from '../patron-profile.service';

@Component({
  selector: 'public-search-patron-profile-fees',
  templateUrl: './patron-profile-fees.component.html'
})
export class PatronProfileFeesComponent implements OnInit, OnDestroy {

  private patronTransactionApiService: PatronTransactionApiService = inject(PatronTransactionApiService);
  private patronProfileService: PatronProfileService = inject(PatronProfileService);
  private patronProfileMenuService: PatronProfileMenuService = inject(PatronProfileMenuService);

  /** Total of fees */
  @Input() feesTotal: number;

  /** First call of get record */
  loaded = false;

  /** requests records */
  records = [];

  /** Records paginator */
  paginator: Paginator;

  /** Observable subscription */
  private subscription = new Subscription();

  get currency() {
    return this.patronProfileMenuService.currentPatron.organisation.currency;
  }

  /** OnInit hook */
  ngOnInit(): void {
    this.paginator = new Paginator();
    this.paginator
      .setHiddenInfo(
        _('({{ count }} hidden fee)'),
        _('({{ count }} hidden fees)')
      );
    this.subscription.add(
      this.paginator.more$.subscribe((page: number) => {
        this._queryFee(page).subscribe((response: Record) => {
          this.records = this.records.concat(response.hits.hits);
        });
      })
    );
    this.subscription.add(
      this.patronProfileService.tabsEvent$.subscribe((event: ITabEvent) => {
        if (event.name === 'fee') {
          if (event.count === 0) {
            this.loaded = true;
          } else {
            this._queryFee(1).subscribe((response: Record) => {
              this.paginator.setRecordsCount(response.hits.total.value);
              this.records = response.hits.hits;
              this.loaded = true;
            });
          }
        }
      })
    );
    /** Cleaning up after the change of organization */
    this.subscription.add(
      this.patronProfileMenuService.onChange$.subscribe(() => {
        this.paginator.setRecordsCount(0);
        this.records = [];
        this.loaded = false;
      })
    );
  }

  /** OnDestroy hook */
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /**
   * Query fee
   * @param page - number
   * @param status - string
   * @return Observable
   */
  private _queryFee(page: number, status: string = 'open'): Observable<Record | Error> {
    const patronPid = this.patronProfileMenuService.currentPatron.pid;
    return this.patronTransactionApiService
      .getFees(patronPid, status, page, this.paginator.getRecordsPerPage());
  }
}
