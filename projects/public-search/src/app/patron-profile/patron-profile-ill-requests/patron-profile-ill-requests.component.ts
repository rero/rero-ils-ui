// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslateDirective } from "@ngx-translate/core";
import { PaginatorComponent } from '@rero/shared';
import { PaginatorState } from 'primeng/paginator';
import { PanelModule } from 'primeng/panel';
import { PatronProfileStore } from '../store/patron-profile.store';
import { PatronProfileIllRequestComponent } from './patron-profile-ill-request/patron-profile-ill-request.component';

@Component({
  selector: 'public-search-patron-profile-ill-requests',
  templateUrl: './patron-profile-ill-requests.component.html',
  imports: [TranslateDirective, PanelModule, PaginatorComponent, PatronProfileIllRequestComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PatronProfileIllRequestsComponent {

  protected store = inject(PatronProfileStore);

  onPageChange(event: PaginatorState): void {
    this.store.changeIllRequestsPager(event);
  }
}
