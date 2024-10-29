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
import { Component, inject, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Record, RecordService } from '@rero/ng-core';
import { IPatron, UserService } from '@rero/shared';
import { forkJoin, Subscription } from 'rxjs';
import { IllRequestApiService } from '../api/ill-request-api.service';
import { LoanApiService } from '../api/loan-api.service';
import { OperationLogsApiService } from '../api/operation-logs-api.service';
import { PatronTransactionApiService } from '../api/patron-transaction-api.service';
import { IMenu, PatronProfileMenuService } from './patron-profile-menu.service';
import { PatronProfileService } from './patron-profile.service';
import { KeyValue } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

interface Tab {
  loaded?: boolean;
  count?: number;
  feeTotal?: number | null;
  title: string;
  order: number;
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

  /** Interface language */
  @Input() language: string;

  /** View code */
  @Input() viewcode: string;

  /** Observable subscription */
  private subscription = new Subscription();

  /** Current logged user */
  user: any;

  /** Tabs informations */
  tabs: Tabs;

  constructor() {
    this.tabs = {
      loan: {
        loaded: false,
        count: 0,
        feeTotal: null,
        title: this.translateService.instant('Loans'),
        order: 0,
      },
      request: {
        loaded: false,
        count: 0,
        title: this.translateService.instant('Requests'),
        order: 1,
      },
      fee: {
        title: this.translateService.instant('Fees'),
        order: 2,
        feeTotal: 0,
      },
      history: {
        loaded: false,
        count: 0,
        title: this.translateService.instant('History'),
        order: 3,
      },
      illRequest: {
        loaded: false,
        count: 0,
        title: this.translateService.instant('Interlibrary load'),
        order: 4,
      },
      personalDetails: {
        title: this.translateService.instant('Personal details'),
        order: 5,
      },
    };
  }

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
    if (a.value.order < b.value.order) return 1;
    if (b.value.order > a.value.order) return -1;
    return 0;
  };

  tabOnChange(event) {
    const tabKey = this.getTabKeyByIndex(event.index);
    this.selectTab(tabKey);
  }

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
   * Show or hide history tab
   * @retun string
   */
  get showHideHistory() {
    return this.user.keep_history ? '' : 'd-none';
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
    this.selectTab(this.getTabKeyByIndex(0));
    this.subscription.add(
      this.patronProfileService.loanFeesEvent$.subscribe((fees: number) => (this.tabs.loan.feeTotal = +fees.toFixed(2)))
    );
    this.user = this.userService.user;
    if (this.user.isAuthenticated && this.user.isPatron) {
      this.subscription.add(
        this.patronProfileMenuService.onChange$.subscribe((menu: IMenu) => {
          this._patronPid = menu.value;
          const loanQuery = this.loanApiService.getOnLoan(this._patronPid, 1, 1, undefined);
          const requestQuery = this.loanApiService.getRequest(this._patronPid, 1, 1, undefined);
          const feeQuery = this.patronTransactionApiService.getFees(this._patronPid, 'open', 1, 1, undefined);
          const historyQuery = this.operationLogsApiService.getHistory(this._patronPid, 1, 1);
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
              this.tabs.loan = {
                ...this.tabs.loan,
                loaded: true,
                count: this.recordService.totalHits(loanResponse.hits.total),
              };
              this.tabs.fee.feeTotal = feeResponse.aggregations.total.value;
              this.tabs.request.count = this.recordService.totalHits(requestResponse.hits.total);
              this.tabs.history.count = this.recordService.totalHits(historyResponse.hits.total);
              this.tabs.illRequest.count = this.recordService.totalHits(illRequestResponse.hits.total);
            }
          );
        })
      );
      /** Update tab history if cancel a request */
      this.subscription.add(
        this.patronProfileService.cancelRequestEvent$.subscribe(() => {
          this.tabs.request.count--;
          this.tabs.history.loaded = false;
          this.operationLogsApiService.getHistory(this._patronPid, 1, 1).subscribe((historyResponse: Record) => {
            this.tabs.history = {
              ...this.tabs.history,
              loaded: false,
              count: this.recordService.totalHits(historyResponse.hits.total),
            };
          });
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
   * Select tab
   * @param tabName - string, name of current selected tab
   */
  selectTab(name: string): void {
    if (name in this.tabs && !this.tabs[name].loaded) {
      this.tabs[name].loaded = true;
      this.patronProfileService.changeTab({ name, count: this.tabs[name].count });
    }
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
