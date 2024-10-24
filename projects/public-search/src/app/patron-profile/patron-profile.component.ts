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
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { forkJoin, Subscription } from 'rxjs';
import { IllRequestApiService } from '../api/ill-request-api.service';
import { LoanApiService } from '../api/loan-api.service';
import { OperationLogsApiService } from '../api/operation-logs-api.service';
import { PatronTransactionApiService } from '../api/patron-transaction-api.service';
import { IMenu, PatronProfileMenuService } from './patron-profile-menu.service';
import { PatronProfileService } from './patron-profile.service';

@Component({
  selector: 'public-search-patron-profile',
  templateUrl: './patron-profile.component.html'
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

  /** Available Tabs */
  @ViewChild('staticTabs', { static: false }) staticTabs: TabsetComponent;

  /** Interface language */
  @Input() language: string;

  /** View code */
  @Input() viewcode: string;

  /** Observable subscription */
  private subscription = new Subscription();

  /** Fees on loans */
  loansFeesTotal = 0;

  /** Fee amount total */
  feeTotal = 0;

  /** Current logged user */
  user: any;

  /** Tabs informations */
  tabs = {
    loan: { loaded: false, count: 0 },
    request: { loaded: false, count: 0 },
    fee: { loaded: false, count: 0 },
    history: { loaded: false, count: 0 },
    illRequest: { loaded: false, count: 0 }
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
   * Show or hide history tab
   * @retun string
   */
  get showHideHistory() {
    return (this.user.keep_history) ? '' : 'd-none';
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
    this.feeTotal = 0;
    this.subscription.add(
      this.patronProfileService.loanFeesEvent$.subscribe((fees: number) =>
        this.loansFeesTotal = +((this.loansFeesTotal + fees).toFixed(2))
      )
    );
    this.user = this.userService.user;
    if (this.user.isAuthenticated && this.user.isPatron) {
      this.subscription.add(
        this.patronProfileMenuService.onChange$.subscribe((menu: IMenu) => {
          this._resetTabs();
          // When the component is initialized, the staticTabs is undefined.
          // After initialization, the staticTabs variable is available.
          if (this.staticTabs) {
            // Loan Selected
            this.staticTabs.tabs[0].active = true;
          }
          this._patronPid = menu.value;
          const loanQuery = this.loanApiService.getOnLoan(this._patronPid, 1, 1, undefined);
          const requestQuery = this.loanApiService.getRequest(this._patronPid, 1, 1, undefined);
          const feeQuery = this.patronTransactionApiService.getFees(this._patronPid, 'open', 1, 1, undefined);
          const historyQuery = this.operationLogsApiService.getHistory(this._patronPid, 1, 1);
          const illRequestQuery = this.illRequestApiService.getPublicIllRequest(this._patronPid, 1, 1, undefined, '', {remove_archived: '1'});
          forkJoin([loanQuery, requestQuery, feeQuery, historyQuery, illRequestQuery])
            .subscribe((
              [loanResponse, requestResponse, feeResponse, historyResponse, illRequestResponse]:
                [Record, Record, Record, Record, Record]
            ) => {
              this.tabs.loan = { loaded: true, count: this.recordService.totalHits(loanResponse.hits.total) };
              this.tabs.request.count = this.recordService.totalHits(requestResponse.hits.total);
              this.tabs.fee.count = this.recordService.totalHits(feeResponse.hits.total);
              this.feeTotal = feeResponse.aggregations.total.value;
              this.tabs.history.count = this.recordService.totalHits(historyResponse.hits.total);
              this.tabs.illRequest.count = this.recordService.totalHits(illRequestResponse.hits.total);
            });
        })
      );
      /** Update tab history if cancel a request */
      this.subscription.add(
        this.patronProfileService.cancelRequestEvent$.subscribe(() => {
          this.tabs.request.count--;
          this.tabs.history.loaded = false;
          this.operationLogsApiService.getHistory(this._patronPid, 1, 1).subscribe((historyResponse: Record) => {
            this.tabs.history = {
              loaded: false,
              count: this.recordService.totalHits(historyResponse.hits.total)
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
    if ((name in this.tabs) && !this.tabs[name].loaded) {
      this.tabs[name].loaded = true;
      this.patronProfileService.changeTab(
        { name, count: this.tabs[name].count }
      );
    }
  }

  /** Reset tabs informations */
  private _resetTabs(): void {
    const keys = Object.keys(this.tabs);
    const l = 'loaded';
    const c = 'count';
    keys.forEach((key: string) => {
      this.tabs[key][l] = false;
      this.tabs[key][c] = 0;
    });
  }

  /**
   * Find patron Pid with current view code
   * @param viewcode - current view code
   * @returns string, patron pid
   */
  private _currentPatronPid(viewcode: string) {
    const currentPatron = this.user.patrons
      .find((patron: any) => patron.organisation.code === viewcode);
    return currentPatron ? currentPatron.pid : this.user.patrons[0].pid;
  }
}
