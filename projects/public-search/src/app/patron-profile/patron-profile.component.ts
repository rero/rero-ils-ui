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
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Record, RecordService, TranslateService } from '@rero/ng-core';
import { IPatron, IUser, UserService } from '@rero/shared';
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

  /** Available Tabs */
  @ViewChild('staticTabs', { static: false }) staticTabs: TabsetComponent;

  /** Interface language */
  @Input() language: string;

  /** Observable subscription */
  private _subscription = new Subscription();

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
    return this._patronProfileMenuService.currentPatron;
  }

  /**
   * Constructor
   * @param _translateService - TranslateService
   * @param _patronTransactionApiService - PatronTransactionApiService
   * @param _recordService - RecordService
   * @param _loanApiService - LoanApiService
   * @param _illRequestApiService - IllRequestApiService
   * @param _patronProfileService - PatronProfileService
   * @param _userService - UserService
   * @param _patronProfileMenuService - PatronProfileMenuService
   * @param _operationLogsService - OperationLogsService
   */
  constructor(
    private _translateService: TranslateService,
    private _patronTransactionApiService: PatronTransactionApiService,
    private _recordService: RecordService,
    private _loanApiService: LoanApiService,
    private _illRequestApiService: IllRequestApiService,
    private _patronProfileService: PatronProfileService,
    private _userService: UserService,
    private _patronProfileMenuService: PatronProfileMenuService,
    private _operationLogsApiService: OperationLogsApiService
  ) {}

  /** OnInit hook */
  ngOnInit(): void {
    this._translateService.setLanguage(this.language);
    this._subscription.add(
      this._userService.loaded$.subscribe((user: IUser) => {
        this.user = user;
        if (this.user.isAuthenticated && this.user.isPatron) {
          this._subscription.add(
            this._patronProfileMenuService.onChange$.subscribe((menu: IMenu) => {
              this._resetTabs();
              // When the component is initialized, the staticTabs is undefined.
              // After initialization, the staticTabs variable is available.
              if (this.staticTabs) {
                // Loan Selected
                this.staticTabs.tabs[0].active = true;
              }
              this._patronPid = menu.value;
              const loanQuery = this._loanApiService.getOnLoan(this._patronPid, 1, 1, undefined);
              const requestQuery = this._loanApiService.getRequest(this._patronPid, 1, 1, undefined);
              const feeQuery = this._patronTransactionApiService.getFees(this._patronPid, 'open', 1, 1, undefined);
              const historyQuery = this._operationLogsApiService.getHistory(this._patronPid, 1, 1);
              const illRequestQuery = this._illRequestApiService.getPublicIllRequest(this._patronPid, 1, 1, undefined);
              forkJoin([loanQuery, requestQuery, feeQuery, historyQuery, illRequestQuery])
              .subscribe((
                [loanResponse, requestResponse, feeResponse, historyResponse, illRequestResponse]:
                [Record, Record, Record, Record, Record]
              ) => {
                this.tabs.loan = { loaded: true, count: this._recordService.totalHits(loanResponse.hits.total) };
                this.tabs.request.count = this._recordService.totalHits(requestResponse.hits.total);
                this.tabs.fee.count = this._recordService.totalHits(feeResponse.hits.total);
                this.feeTotal = feeResponse.aggregations.total.value;
                this.tabs.history.count = this._recordService.totalHits(historyResponse.hits.total);
                this.tabs.illRequest.count = this._recordService.totalHits(illRequestResponse.hits.total);
              });
            })
          );
          /** Update tab history if cancel a request */
          this._subscription.add(
            this._patronProfileService.cancelRequestEvent$.subscribe(() => {
              this.tabs.request.count--;
              this.tabs.history.loaded = false;
              this._operationLogsApiService.getHistory(this._patronPid, 1, 1).subscribe((historyResponse: Record) => {
                this.tabs.history = {
                  loaded: false,
                  count: this._recordService.totalHits(historyResponse.hits.total)
                };
              });
            })
          );
          this._patronProfileMenuService.change(user.patrons[0].pid);
        }
      })
    );
  }

  /** OnDestroy hook */
  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  /**
   * Select tab
   * @param tabName - string, name of current selected tab
   */
  selectTab(name: string): void {
    if ((name in this.tabs) && !this.tabs[name].loaded) {
      this.tabs[name].loaded = true;
      this._patronProfileService.changeTab(
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
}
