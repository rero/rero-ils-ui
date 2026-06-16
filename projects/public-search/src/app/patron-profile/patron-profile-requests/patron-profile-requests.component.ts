// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslateDirective } from "@ngx-translate/core";
import { PaginatorComponent } from '@rero/shared';
import { PanelModule } from 'primeng/panel';
import { PaginatorState } from 'primeng/paginator';
import { PatronProfileStore } from '../store/patron-profile.store';
import { PatronProfileRequestComponent } from './patron-profile-request/patron-profile-request.component';

@Component({
    selector: 'public-search-patron-profile-requests',
    templateUrl: './patron-profile-requests.component.html',
    imports: [TranslateDirective, PanelModule, PaginatorComponent, PatronProfileRequestComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PatronProfileRequestsComponent {

  protected store = inject(PatronProfileStore);

  // COMPONENTS FUNCTIONS =====================================================
  /** Update the pager; the store loads the selected page automatically. */
  onPageChange(event: PaginatorState): void {
    this.store.changeRequestPager(event);
  }
}
