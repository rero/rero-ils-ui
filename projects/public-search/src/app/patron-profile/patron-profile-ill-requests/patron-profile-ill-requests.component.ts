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
import { IllRequestApiService } from '../../api/ill-request-api.service';
import { PatronProfileMenuService } from '../patron-profile-menu.service';
import { ITabEvent, PatronProfileService } from '../patron-profile.service';

@Component({
  selector: 'public-search-patron-profile-ill-requests',
  templateUrl: './patron-profile-ill-requests.component.html'
})
export class PatronProfileIllRequestsComponent implements OnInit, OnDestroy {

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

  /**
   * Constructor
   * @param _illRequestApiService - IllRequestApiService
   * @param _userService - UserService
   * @param _patronProfileService - PatronProfileService
   * @param _patronProfileMenuService - PatronProfileMenuService
   */
  constructor(
    private _illRequestApiService: IllRequestApiService,
    private _patronProfileService: PatronProfileService,
    private _patronProfileMenuService: PatronProfileMenuService
  ) {}

  /** OnInit hook */
  ngOnInit(): void {
    this._paginator = new Paginator();
    this._paginator
      .setHiddenInfo(
        _('({{ count }} hidden ill request)'),
        _('({{ count }} hidden ill requests)')
      );
    this._subscription.add(
      this._paginator.more$.subscribe((page: number) => {
        this._illRequestQuery(page).subscribe((response: Record) => {
          this.records = this.records.concat(response.hits.hits);
        });
      })
    );
    this._subscription.add(
      this._patronProfileService.tabsEvent$.subscribe((event: ITabEvent) => {
        if (event.name === 'illRequest') {
          if (event.count === 0) {
            this.loaded = true;
          } else {
            this._illRequestQuery(1).subscribe((response: Record) => {
              this._paginator.setRecordsCount(response.hits.total.value);
              this.records = response.hits.hits;
              this.loaded = true;
            });
          }
        }
      })
    );
    /** Cleaning up after the change of organization */
    this._subscription.add(
      this._patronProfileMenuService.onChange$.subscribe(() => {
        this.paginator.setRecordsCount(0);
        this.records = [];
        this.loaded = false;
      })
    );
  }

  /** OnDestroy hook */
  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  /**
   * Ill request query
   * @param page - number
   * @return Observable
   */
  private _illRequestQuery(page: number): Observable<Record | Error> {
    const patronPid = this._patronProfileMenuService.currentPatron.pid;
    return this._illRequestApiService
      .getIllRequest(patronPid, page, this._paginator.getRecordsPerPage());
  }
}
