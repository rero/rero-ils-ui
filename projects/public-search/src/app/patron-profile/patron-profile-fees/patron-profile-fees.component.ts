// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { CurrencyPipe } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { PanelModule } from '@openng/optimus-ui/panel';

import { PatronProfileStore } from '../store/patron-profile.store';
import { PatronProfileFeeComponent } from './patron-profile-fee/patron-profile-fee.component';

@Component({
  selector: 'public-search-patron-profile-fees',
  templateUrl: './patron-profile-fees.component.html',
  imports: [CurrencyPipe, TranslatePipe, PanelModule, PatronProfileFeeComponent],
})
export class PatronProfileFeesComponent {
  protected store = inject(PatronProfileStore);

  feesTotal = input<number>();

  get currency() {
    return this.store.currentPatron()?.organisation.currency;
  }
}
