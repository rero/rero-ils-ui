// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateDirective, TranslatePipe, TranslateService } from '@ngx-translate/core';
import { NgxSpinnerComponent, NgxSpinnerService } from 'ngx-spinner';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { Select } from 'primeng/select';
import { PatronProfileStore } from '../store/patron-profile.store';
import { PatronProfileLoanComponent } from './patron-profile-loan/patron-profile-loan.component';

@Component({
  selector: 'public-search-patron-profile-loans',
  templateUrl: './patron-profile-loans.component.html',
  imports: [
    FormsModule,
    TranslateDirective,
    TranslatePipe,
    NgxSpinnerComponent,
    ButtonModule,
    Select,
    PanelModule,
    PatronProfileLoanComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PatronProfileLoansComponent {

  protected store = inject(PatronProfileStore);
  private translateService = inject(TranslateService);
  private spinner = inject(NgxSpinnerService);

  constructor() {
    // Spinner when renewing all loans
    effect(() => {
      const renewingAll = this.store.renewingLoans() && this.store.renewingLoanPid() === null;
      void (renewingAll
        ? this.spinner.show('renew-all-loans')
        : this.spinner.hide('renew-all-loans'));
    });
  }

  get sortOptions() {
    return [
      { value: 'duedate', label: this.translateService.instant('Due date (earliest)'), icon: 'fa-solid fa-arrow-down-1-9' },
      { value: '-duedate', label: this.translateService.instant('Due date (latest)'), icon: 'fa-solid fa-arrow-down-9-1' },
    ];
  }
}
