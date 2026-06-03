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
import { ChangeDetectionStrategy, Component, effect, inject, OnInit, signal, untracked } from '@angular/core';
import { _, TranslateDirective } from "@ngx-translate/core";
import { Paginator, ShowMorePagerComponent } from '@rero/shared';
import { PanelModule } from 'primeng/panel';
import { OperationLogsApiService } from '../../api/operation-logs-api.service';
import { PatronProfileStore } from '../store/patron-profile.store';
import { PatronProfileHistoryComponent } from './patron-profile-history/patron-profile-history.component';

@Component({
    selector: 'public-search-patron-profile-histories',
    templateUrl: './patron-profile-histories.component.html',
    imports: [TranslateDirective, PanelModule, ShowMorePagerComponent, PatronProfileHistoryComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PatronProfileHistoriesComponent implements OnInit {

  private operationLogsApiService = inject(OperationLogsApiService);
  private store = inject(PatronProfileStore);

  readonly loaded = signal(false);
  readonly records = signal<any[]>([]);

  isCollapsed = true;

  paginator: Paginator;

  constructor() {
    effect(() => {
      this.store.currentPatron();
      untracked(() => this._reset());
    });
    effect(() => {
      if (this.store.activeTab() === 'history') {
        untracked(() => this._initialLoad());
      }
    });
    effect(() => {
      const pid = this.store.cancelledRequestPid();
      if (pid) {
        untracked(() => {
          this.records.set([]);
          if (this.paginator) this.paginator.setRecordsCount(0);
        });
      }
    });
  }

  ngOnInit(): void {
    this.paginator = new Paginator();
    this.paginator.setHiddenInfo(
      _('({{ count }} hidden history)'),
      _('({{ count }} hidden histories)')
    );
    this.paginator.more$.subscribe((page: number) => {
      this._historyQuery(page).subscribe((response) => {
        if (!('hits' in response)) return;
        this.records.update(r => [...r, ...response.hits.hits]);
      });
    });
  }

  private _initialLoad(): void {
    if (!this.paginator) return;
    this._historyQuery(1).subscribe((response) => {
      if (!('hits' in response)) return;
      this.paginator.setRecordsCount(response.hits.total.value);
      this.records.set(response.hits.hits);
      this.loaded.set(true);
    });
  }

  private _reset(): void {
    if (!this.paginator) return;
    this.paginator.setRecordsCount(0);
    this.records.set([]);
    this.loaded.set(false);
  }

  private _historyQuery(page: number) {
    const patronPid = this.store.currentPatron()!.pid;
    return this.operationLogsApiService.getHistory(patronPid, page, this.paginator.getRecordsPerPage());
  }
}
