// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { PaginatorState } from '@openng/optimus-ui/paginator';
import { PanelModule } from '@openng/optimus-ui/panel';
import { PaginatorComponent } from '@rero/shared';

import { PatronProfileStore } from '../store/patron-profile.store';
import { PatronProfileIllRequestComponent } from './patron-profile-ill-request/patron-profile-ill-request.component';

@Component({
  selector: 'public-search-patron-profile-ill-requests',
  templateUrl: './patron-profile-ill-requests.component.html',
  imports: [TranslatePipe, PanelModule, PaginatorComponent, PatronProfileIllRequestComponent],
})
export class PatronProfileIllRequestsComponent {
  protected store = inject(PatronProfileStore);

  onPageChange(event: PaginatorState): void {
    this.store.changeIllRequestsPager(event);
  }
}
