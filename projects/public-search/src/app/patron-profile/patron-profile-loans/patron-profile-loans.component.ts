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
import { ChangeDetectionStrategy, Component, effect, inject, signal, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { _, TranslateDirective, TranslateService } from "@ngx-translate/core";
import { Paginator, ShowMorePagerComponent } from '@rero/shared';
import { PanelModule } from 'primeng/panel';
import { Select } from 'primeng/select';
import { LoanApiService } from '../../api/loan-api.service';
import { PatronProfileStore } from '../store/patron-profile.store';
import { PatronProfileLoanComponent } from './patron-profile-loan/patron-profile-loan.component';

@Component({
    selector: 'public-search-patron-profile-loans',
    templateUrl: './patron-profile-loans.component.html',
    imports: [FormsModule, TranslateDirective, Select, PanelModule, ShowMorePagerComponent, PatronProfileLoanComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PatronProfileLoansComponent {

  private loanApiService = inject(LoanApiService);
  private store = inject(PatronProfileStore);
  private translateService = inject(TranslateService);

  readonly loaded = signal(false);
  readonly records = signal<any[]>([]);

  sortCriteria = 'duedate';

  get sortOptions() {
    return [
      { value: 'duedate', label: this.translateService.instant('Due date (earliest)'), icon: 'fa fa-sort-numeric-asc' },
      { value: '-duedate', label: this.translateService.instant('Due date (latest)'), icon: 'fa fa-sort-numeric-desc' },
    ];
  }

  page = 1;
  nRecords = 20;
  paginator: Paginator;

  constructor() {
    this.paginator = new Paginator();
    this.paginator
      .setRecordsPerPage(this.nRecords)
      .setHiddenInfo(
        _('({{ count }} hidden loan)'),
        _('({{ count }} hidden loans)')
      );
    this.paginator.more$.subscribe((page: number) => {
      this._loanQuery(page).subscribe((response) => {
        if (!('hits' in response)) return;
        this.records.update(r => [...r, ...response.hits.hits]);
        this.page = page;
      });
    });
    effect(() => {
      this.store.currentPatron();
      untracked(() => this._load());
    });
  }

  selectingSortCriteria(sortCriteria: string): void {
    this.sortCriteria = sortCriteria;
    this.paginator.setRecordsPerPage(this.page * this.nRecords);
    this._loanQuery(1).subscribe((response) => {
      if (!('hits' in response)) return;
      this.records.set(response.hits.hits);
      this.paginator.setRecordsPerPage(this.nRecords);
      this.loaded.set(true);
    });
  }

  private _loanQuery(page: number) {
    const patronPid = this.store.currentPatron()!.pid;
    return this.loanApiService.getOnLoan(patronPid, page, this.paginator.getRecordsPerPage(), undefined, this.sortCriteria);
  }

  private _load(): void {
    this.loaded.set(false);
    this._loanQuery(1).subscribe((response) => {
      if (!('hits' in response)) return;
      this.paginator.setPage(1).setRecordsCount(response.hits.total.value);
      this.records.set(response.hits.hits);
      this.loaded.set(true);
    });
  }
}
