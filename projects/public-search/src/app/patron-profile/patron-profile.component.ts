// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { APP_BASE_HREF, CurrencyPipe, KeyValue, KeyValuePipe } from '@angular/common';
import { afterNextRender, Component, effect, inject, model, OnInit, signal, untracked, ChangeDetectionStrategy} from '@angular/core';
import { TranslateDirective, TranslatePipe, TranslateService } from '@ngx-translate/core';
import { RecordService } from '@rero/ng-core';
import type { EsResult } from '@rero/ng-core';
import { AppStore } from '@rero/shared';
import JsBarcode from 'jsbarcode';
import { forkJoin, of } from 'rxjs';
import { BadgeModule } from 'primeng/badge';
import { TabsModule } from 'primeng/tabs';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { IllRequestApiService } from '../api/ill-request-api.service';
import { LoanApiService } from '../api/loan-api.service';
import { OperationLogsApiService } from '../api/operation-logs-api.service';
import { PatronTransactionApiService } from '../api/patron-transaction-api.service';
import { PatronApiService } from '../api/patron-api.service';
import { overdueFee } from './patron-profile-fees/types';
import { PatronProfileStore } from './store/patron-profile.store';
import { PatronProfileMenuComponent } from './patron-profile-menu/patron-profile-menu.component';
import { PatronProfileMessageComponent } from './patron-profile-message/patron-profile-message.component';
import { PatronProfileLoansComponent } from './patron-profile-loans/patron-profile-loans.component';
import { PatronProfileRequestsComponent } from './patron-profile-requests/patron-profile-requests.component';
import { PatronProfileFeesComponent } from './patron-profile-fees/patron-profile-fees.component';
import { PatronProfileHistoriesComponent } from './patron-profile-histories/patron-profile-histories.component';
import { PatronProfileIllRequestsComponent } from './patron-profile-ill-requests/patron-profile-ill-requests.component';
import { PatronProfilePersonalComponent } from './patron-profile-personal/patron-profile-personal.component';

type Tab = {
  loaded?: boolean;
  count?: number;
  feeTotal?: number | null;
  title: string;
  order: number;
  tooltip?: string;
  display: boolean;
}

type Tabs = {
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
    imports: [
      CurrencyPipe,
      KeyValuePipe,
      TranslateDirective,
      TranslatePipe,
      BadgeModule,
      TabsModule,
      ToastModule,
      TooltipModule,
      PatronProfileMenuComponent,
      PatronProfileMessageComponent,
      PatronProfileLoansComponent,
      PatronProfileRequestsComponent,
      PatronProfileFeesComponent,
      PatronProfileHistoriesComponent,
      PatronProfileIllRequestsComponent,
      PatronProfilePersonalComponent,
    ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PatronProfileComponent implements OnInit {
  private patronTransactionApiService = inject(PatronTransactionApiService);
  private recordService = inject(RecordService);
  private loanApiService = inject(LoanApiService);
  private illRequestApiService = inject(IllRequestApiService);
  private appStore = inject(AppStore);
  private store = inject(PatronProfileStore);
  private operationLogsApiService = inject(OperationLogsApiService);
  private translateService = inject(TranslateService);
  private patronApiService = inject(PatronApiService);
  private baseHref = inject(APP_BASE_HREF);

  /** View code */
  viewcode = 'global';

  /** Current logged user */
  user: any;

  activeTab = model<undefined | string>(undefined);

  /** Tabs */
  readonly tabs = signal<Tabs>({
    loan: {
      loaded: false,
      count: 0,
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
  });

  get fullname() {
    return [this.user.first_name, this.user.last_name].join(' ');
  }

  get patron() {
    return this.store.currentPatron();
  }

  sortTabs = (a: KeyValue<string, any>, b: KeyValue<string, any>): number =>
    a.value.order - b.value.order;

  getTabKeyByIndex(index: number): string | null {
    for (const [key, value] of Object.entries(this.tabs())) {
      if (value.order === index) return key;
    }
    return null;
  }

  constructor() {
    afterNextRender(() => {
      const barcode = this.store.currentPatron()?.patron.barcode[0];
      if (barcode) {
        JsBarcode('#barcode', barcode, { format: 'CODE39', margin: 0, font: 'monospace' });
      }
    });

    effect(() => {
      const tab = this.activeTab();
      if (tab) {
        untracked(() => {
          this.tabs.update(t => ({ ...t, [tab]: { ...t[tab as keyof Tabs], loaded: true } }));
          this.store.changeTab(tab);
        });
      }
    });

    effect(() => {
      const patron = this.store.currentPatron();
      if (!patron) return;
      untracked(() => this._loadCounts(patron.pid));
    });

    effect(() => {
      const pid = this.store.cancelledRequestPid();
      if (!pid) return;
      untracked(() => {
        this.tabs.update(t => ({ ...t, request: { ...t.request, count: (t.request.count ?? 0) - 1 } }));
        const keepHistory = this.appStore.user()?.keep_history ?? false;
        if (keepHistory) {
          const patronPid = this.store.currentPatron()?.pid;
          if (patronPid) {
            this.operationLogsApiService.getHistory(patronPid, 1, 1).subscribe((r) => {
              if (!('hits' in r)) return;
              this.tabs.update(t => ({
                ...t,
                history: { ...t.history, loaded: false, count: +this.recordService.totalHits(r.hits.total) },
              }));
            });
          }
        }
      });
    });
  }

  ngOnInit(): void {
    const pathParts = this.baseHref.split('/');
    if (pathParts.length > 1) this.viewcode = pathParts[1];

    this.user = this.appStore.user();
    if (this.user.isAuthenticated && this.user.isPatron) {
      const keepHistory = this.user.keep_history ?? false;
      this.tabs.update(t => ({ ...t, history: { ...t.history, display: keepHistory } }));
      this.store.changePatron(this._currentPatronPid(this.viewcode));
    }
  }

  private _loadCounts(patronPid: string): void {
    const keepHistory = this.appStore.user()?.keep_history ?? false;
    forkJoin([
      this.loanApiService.getOnLoan(patronPid, 1, 1, undefined),
      this.loanApiService.getRequest(patronPid, 1, 1, undefined),
      this.patronTransactionApiService.getFees(patronPid, 'open', 1, 1, undefined),
      this.patronApiService.getOverduePreviewByPatronPid(patronPid),
      keepHistory ? this.operationLogsApiService.getHistory(patronPid, 1, 1) : of(undefined),
      this.illRequestApiService.getPublicIllRequest(patronPid, 1, 1, undefined, '', { remove_archived: '1' }),
    ]).subscribe((results) => {
      const [loanResponse, requestResponse, feeResponse, overdueResponse, historyResponse, illRequestResponse] =
        results as [EsResult, EsResult, EsResult, overdueFee[], EsResult, EsResult];
      this.activeTab.set('loan');
      const feeTotal = overdueResponse.reduce(
        (acc: number, fee: overdueFee) => acc + +fee.fees.total,
        (feeResponse.aggregations as any).total.value
      );
      this.tabs.update(t => ({
        ...t,
        loan: { ...t.loan, loaded: false, count: +this.recordService.totalHits(loanResponse.hits.total) },
        request: { ...t.request, loaded: false, count: +this.recordService.totalHits(requestResponse.hits.total) },
        fee: { ...t.fee, loaded: false, feeTotal },
        illRequest: { ...t.illRequest, loaded: false, count: +this.recordService.totalHits(illRequestResponse.hits.total) },
        history: { ...t.history, loaded: false, count: historyResponse?.hits?.total ? +this.recordService.totalHits(historyResponse.hits.total) : t.history.count },
        personalDetails: { ...t.personalDetails, loaded: false },
      }));
    });
  }

  private _currentPatronPid(viewcode: string): string {
    const match = this.user.patrons.find((p: any) => p.organisation.code === viewcode);
    return match ? match.pid : this.user.patrons[0].pid;
  }
}
