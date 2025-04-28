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
import { APP_BASE_HREF, KeyValue } from '@angular/common';
import { Component, inject, model, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Record, RecordService } from '@rero/ng-core';
import { IPatron, UserService } from '@rero/shared';
import { forkJoin, of, Subscription } from 'rxjs';
import { IllRequestApiService } from '../api/ill-request-api.service';
import { LoanApiService } from '../api/loan-api.service';
import { OperationLogsApiService } from '../api/operation-logs-api.service';
import { PatronTransactionApiService } from '../api/patron-transaction-api.service';
import { IMenu, PatronProfileMenuService } from './patron-profile-menu.service';
import { PatronProfileService } from './patron-profile.service';

interface Tab {
  loaded?: boolean;
  count?: number;
  feeTotal?: number | null;
  title: string;
  order: number;
  tooltip?: string;
  display: boolean;
}

interface Tabs {
  loan: Tab;
  request: Tab;
  fee: Tab;
  history: Tab;
  illRequest: Tab;
  personalDetails: Tab;
}

@Component({
    selector: 'public-search-patron-profile',
    templateUrl: './patron-profile.component.html',
    standalone: false
})
export class PatronProfileComponent implements OnInit, OnDestroy {
  private patronTransactionApiService: PatronTransactionApiService = inject(PatronTransactionApiService);
  private recordService: RecordService = inject(RecordService);
  private loanApiService: LoanApiService = inject(LoanApiService);
  private illRequestApiService: IllRequestApiService = inject(IllRequestApiService);
  private patronProfileService: PatronProfileService = inject(PatronProfileService);
  private userService: UserService = inject(UserService);
  private patronProfileMenuService: PatronProfileMenuService = inject(PatronProfileMenuService);
  private operationLogsApiService: OperationLogsApiService = inject(OperationLogsApiService);
  private translateService: TranslateService = inject(TranslateService);
  private baseHref = inject(APP_BASE_HREF);


  /** View code */
  viewcode: string = 'global';

  /** Observable subscription */
  private subscription = new Subscription();

  /** Current logged user */
  user: any;

  activeTab = model<undefined | string >(undefined);

  /** Tabs */
  tabs: Tabs = {
    loan: {
      loaded: false,
      count: 0,
      feeTotal: 0,
      title: this.translateService.instant('Loans'),
      order: 0,
      tooltip: this.translateService.instant('Fees to date'),
      display: true
    },
    request: {
      loaded: false,
      count: 0,
      title: this.translateService.instant('Requests'),
      order: 1,
      display: true
    },
    fee: {
      title: this.translateService.instant('Fees'),
      order: 2,
      feeTotal: 0,
      display: true
    },
    illRequest: {
      loaded: false,
      count: 0,
      title: this.translateService.instant('Interlibrary loan'),
      order: 4,
      display: true
    },
    history: {
      loaded: false,
      count: 0,
      title: this.translateService.instant('History'),
      order: 3,
      display: true
    },
    personalDetails: {
      title: this.translateService.instant('Personal details'),
      order: 5,
      display: true
    },
  };

  /** Current patron pid */
  private _patronPid: string;

  /**
   * Fullname of current user
   * @return string
   */
  get fullname() {
    return [this.user.first_name, this.user.last_name].join(' ');
  }

  /**
   * Comparison function to sort tabs.
   * Takes two `KeyValue` objects with a `string` key and an `any` value as input.
   *
   * @param a - The first `KeyValue` object to compare, where `a.key` is the `string` key and `a.value` is the associated value.
   * @param b - The second `KeyValue` object to compare, where `b.key` is the `string` key and `b.value` is the associated value.
   * @returns `number` - Returns:
   *  - a negative number if `a` should appear before `b`,
   *  - a positive number if `a` should appear after `b`,
   *  - zero if `a` and `b` are considered equal in sort order.
   */
  sortTabs = (a: KeyValue<string, any>, b: KeyValue<string, any>): number => {
    return a.value.order - b.value.order;
  };

  /**
   * Retrieves the key of a tab based on its index value.
   * Iterates through the `tabs` object to find the tab that matches the given `order` property.
   *
   * @param index - The index to compare with the `order` property of each tab.
   * @returns `string | null` - Returns the key of the matching tab if found; otherwise, returns `null`.
   */
  getTabKeyByIndex(index): string | null {
    for (const [key, value] of Object.entries(this.tabs)) {
      if (value.order === index) {
        return key;
      }
    }
    return null;
  }

  /**
   * Current patron
   * @return IPatron
   */
  get patron(): IPatron {
    return this.patronProfileMenuService.currentPatron;
  }

  /** OnInit hook */
  ngOnInit(): void {
    const pathParts = this.baseHref.split('/');
    if( pathParts.length > 1) {
      this.viewcode = pathParts[1];
    }
    this.activeTab.subscribe((tabSelected: string) => {
      this.tabs[tabSelected].loaded = true;
      this.patronProfileService.changeTab({ name: tabSelected, count: this.tabs[tabSelected].count });
    });
    this.subscription.add(
      this.patronProfileService.loanFeesEvent$.subscribe((fees: number) => (this.tabs.loan.feeTotal = +fees.toFixed(2)))
    );
    this.user = this.userService.user;
    if (this.user.isAuthenticated && this.user.isPatron) {
      const keepHistory = this.user.keep_history === undefined ? false : this.user.keep_history;
      this.tabs.history.display = keepHistory;
      this.subscription.add(
        this.patronProfileMenuService.onChange$.subscribe((menu: IMenu) => {
          this._patronPid = menu.value;
          const loanQuery = this.loanApiService.getOnLoan(this._patronPid, 1, 1, undefined);
          const requestQuery = this.loanApiService.getRequest(this._patronPid, 1, 1, undefined);
          const feeQuery = this.patronTransactionApiService.getFees(this._patronPid, 'open', 1, 1, undefined);
          const historyQuery = keepHistory ? this.operationLogsApiService.getHistory(this._patronPid, 1, 1) : of(undefined);
          const illRequestQuery = this.illRequestApiService.getPublicIllRequest(this._patronPid, 1, 1, undefined, '', {
            remove_archived: '1',
          });
          forkJoin([loanQuery, requestQuery, feeQuery, historyQuery, illRequestQuery]).subscribe(
            ([loanResponse, requestResponse, feeResponse, historyResponse, illRequestResponse]: [
              Record,
              Record,
              Record,
              Record,
              Record
            ]) => {
              this.activeTab.set('loan');
              Object.values(this.tabs).map(tab => tab.loaded = false);
              this.tabs.loan.count = this.recordService.totalHits(loanResponse.hits.total);
              this.tabs.fee.feeTotal = feeResponse.aggregations.total.value;
              this.tabs.request.count = this.recordService.totalHits(requestResponse.hits.total);
              this.tabs.illRequest.count = this.recordService.totalHits(illRequestResponse.hits.total);
              if (historyQuery) {
                this.tabs.history.count = this.recordService.totalHits(historyResponse.hits.total);
              }
            }
          );
        })
      );
      /** Update tab history if cancel a request */
      this.subscription.add(
        this.patronProfileService.cancelRequestEvent$.subscribe(() => {
          this.tabs.request.count--;
          if (keepHistory) {
            this.tabs.history.loaded = false;
            this.operationLogsApiService.getHistory(this._patronPid, 1, 1).subscribe((historyResponse: Record) => {
              this.tabs.history = {
                ...this.tabs.history,
                loaded: false,
                count: this.recordService.totalHits(historyResponse.hits.total),
              };
            });
          }
        })
      );
      this.patronProfileMenuService.change(this._currentPatronPid(this.viewcode));
    }
  }

  /** OnDestroy hook */
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /**
   * Find patron Pid with current view code
   * @param viewcode - current view code
   * @returns string, patron pid
   */
  private _currentPatronPid(viewcode: string) {
    const currentPatron = this.user.patrons.find((patron: any) => patron.organisation.code === viewcode);
    return currentPatron ? currentPatron.pid : this.user.patrons[0].pid;
  }
}
