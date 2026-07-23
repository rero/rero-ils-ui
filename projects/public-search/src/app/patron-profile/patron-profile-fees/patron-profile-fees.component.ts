// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { CurrencyPipe } from '@angular/common';
import { Component, inject, input, ChangeDetectionStrategy } from '@angular/core';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { PanelModule } from 'primeng/panel';
import { PatronProfileStore } from '../store/patron-profile.store';
import { PatronProfileFeeComponent } from './patron-profile-fee/patron-profile-fee.component';

@Component({
    selector: 'public-search-patron-profile-fees',
    templateUrl: './patron-profile-fees.component.html',
    imports: [CurrencyPipe, TranslateDirective, TranslatePipe, PanelModule, PatronProfileFeeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PatronProfileFeesComponent {

  protected store = inject(PatronProfileStore);

  feesTotal = input<number>();

  get currency() {
    return this.store.currentPatron()?.organisation.currency;
  }
}
