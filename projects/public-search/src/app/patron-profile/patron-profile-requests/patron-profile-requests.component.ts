// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { PaginatorState } from '@openng/optimus-ui/paginator';
import { PanelModule } from '@openng/optimus-ui/panel';
import { PaginatorComponent } from '@rero/shared';

import { PatronProfileStore } from '../store/patron-profile.store';
import { PatronProfileRequestComponent } from './patron-profile-request/patron-profile-request.component';

@Component({
  selector: 'public-search-patron-profile-requests',
  templateUrl: './patron-profile-requests.component.html',
  imports: [TranslatePipe, PanelModule, PaginatorComponent, PatronProfileRequestComponent],
})
export class PatronProfileRequestsComponent {
  protected store = inject(PatronProfileStore);

  // COMPONENTS FUNCTIONS =====================================================
  /** Update the pager; the store loads the selected page automatically. */
  onPageChange(event: PaginatorState): void {
    this.store.changeRequestPager(event);
  }
}
