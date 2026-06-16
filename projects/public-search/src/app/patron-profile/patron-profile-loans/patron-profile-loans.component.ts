// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { ChangeDetectionStrategy, Component, effect, inject, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateDirective, TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { Select } from 'primeng/select';
import { PatronProfileStore } from '../store/patron-profile.store';
import { PatronProfileLoanComponent } from './patron-profile-loan/patron-profile-loan.component';

@Component({
    selector: 'public-search-patron-profile-loans',
    templateUrl: './patron-profile-loans.component.html',
    imports: [FormsModule, TranslateDirective, TranslatePipe, ButtonModule, Select, PanelModule, PatronProfileLoanComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PatronProfileLoansComponent {

  private readonly loansPerPage = 9999;

  protected store = inject(PatronProfileStore);
  private translateService = inject(TranslateService);

  get sortOptions() {
    return [
      { value: 'duedate', label: this.translateService.instant('Due date (earliest)'), icon: 'fa-solid fa-arrow-down-1-9' },
      { value: '-duedate', label: this.translateService.instant('Due date (latest)'), icon: 'fa-solid fa-arrow-down-9-1' },
    ];
  }

  constructor() {
    effect(() => {
      this.store.currentPatron();
      untracked(() => this._load());
    });
  }

  selectingSortCriteria(sortCriteria: string): void {
    this.store.changeLoansSortCriteria(sortCriteria);
    this.store.loadLoans(1, this.loansPerPage).subscribe((response) => {
      if (!('hits' in response)) return;
      this._loadCanExtend(response.hits.hits);
    });
  }

  private _load(): void {
    this.store.loadLoans(1, this.loansPerPage).subscribe((response) => {
      if (!('hits' in response)) return;
      this._loadCanExtend(response.hits.hits);
    });
  }

  private _loadCanExtend(loans: any[]): void {
    loans.forEach(loan => {
      this.store.canExtendLoan(loan.metadata.pid).subscribe();
    });
  }
}
