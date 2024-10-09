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
import { ITabEvent, PatronProfileService } from '../patron-profile.service';

@Component({
  selector: 'public-search-patron-profile-requests',
  templateUrl: './patron-profile-requests.component.html'
})
export class PatronProfileRequestsComponent implements OnInit, OnDestroy {

  private loanApiService: LoanApiService = inject(LoanApiService);
  private patronProfileService: PatronProfileService = inject(PatronProfileService);
  private patronProfileMenuService: PatronProfileMenuService = inject(PatronProfileMenuService);

  /** First call of get record */
  loaded = false;

  /** requests records */
  records = [];

  /** Records paginator */
  paginator: Paginator;

  /** Observable subscription */
  private subscription = new Subscription();

  /** OnInit hook */
  ngOnInit(): void {
    this.paginator = new Paginator();
    this.paginator
      .setHiddenInfo(
        _('({{ count }} hidden request)'),
        _('({{ count }} hidden requests)')
      );
    this.subscription.add(
      this.paginator.more$.subscribe((page: number) => {
        this._requestQuery(page).subscribe((response: Record) => {
          this.records = this.records.concat(response.hits.hits);
        });
      })
    );
    this.subscription.add(
      this.patronProfileService.tabsEvent$.subscribe((event: ITabEvent) => {
        if (event.name === 'request') {
          if (event.count === 0) {
            this.loaded = true;
          } else {
            this._requestQuery(1).subscribe((response: Record) => {
              this.paginator.setRecordsCount(response.hits.total.value);
              this.records = response.hits.hits;
              this.loaded = true;
            });
          }
        }
      })
    );
    this.subscription.add(
      this.patronProfileService.cancelRequestEvent$.subscribe((requestPid: string) => {
        this.records = this.records.filter(record => record.metadata.pid !== requestPid);
        this.paginator.setRecordsCount(this.records.length);
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
   * Request query
   * @param page, number
   * @return Observable
   */
  private _requestQuery(page: number): Observable<Record | Error> {
    const patronPid = this.patronProfileMenuService.currentPatron.pid;
    return this.loanApiService
      .getRequest(patronPid, page, this.paginator.getRecordsPerPage());
  }
}
