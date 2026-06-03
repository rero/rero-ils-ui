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
import { LoanApiService } from '../../api/loan-api.service';
import { PatronProfileStore } from '../store/patron-profile.store';
import { PatronProfileRequestComponent } from './patron-profile-request/patron-profile-request.component';

@Component({
    selector: 'public-search-patron-profile-requests',
    templateUrl: './patron-profile-requests.component.html',
    imports: [TranslateDirective, PanelModule, ShowMorePagerComponent, PatronProfileRequestComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PatronProfileRequestsComponent implements OnInit {

  private loanApiService = inject(LoanApiService);
  private store = inject(PatronProfileStore);

  readonly loaded = signal(false);
  readonly records = signal<any[]>([]);

  paginator: Paginator;

  constructor() {
    effect(() => {
      this.store.currentPatron();
      untracked(() => this._reset());
    });
    effect(() => {
      if (this.store.activeTab() === 'request') {
        untracked(() => this._initialLoad());
      }
    });
    effect(() => {
      const pid = this.store.cancelledRequestPid();
      if (pid) {
        untracked(() => {
          this.records.update(r => r.filter(record => record.metadata.pid !== pid));
          if (this.paginator) this.paginator.setRecordsCount(this.records().length);
        });
      }
    });
  }

  ngOnInit(): void {
    this.paginator = new Paginator();
    this.paginator.setHiddenInfo(
      _('({{ count }} hidden request)'),
      _('({{ count }} hidden requests)')
    );
    this.paginator.more$.subscribe((page: number) => {
      this._requestQuery(page).subscribe((response) => {
        if (!('hits' in response)) return;
        this.records.update(r => [...r, ...response.hits.hits]);
      });
    });
  }

  private _initialLoad(): void {
    if (!this.paginator) return;
    this._requestQuery(1).subscribe((response) => {
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

  private _requestQuery(page: number) {
    const patronPid = this.store.currentPatron()!.pid;
    return this.loanApiService.getRequest(patronPid, page, this.paginator.getRecordsPerPage());
  }
}
