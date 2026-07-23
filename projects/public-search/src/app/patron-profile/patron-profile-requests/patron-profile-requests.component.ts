// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { ChangeDetectionStrategy, Component, effect, inject, untracked } from '@angular/core';
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

  constructor() {
    effect(() => {
      this.store.currentPatron();
      untracked(() => {
        this.store.resetRequests();
        if (this.store.activeTab() === 'request') this._initialLoad();
      });
    });
    effect(() => {
      if (this.store.activeTab() === 'request') {
        untracked(() => this._initialLoad());
      }
    });
  }

  onPageChange(event: PaginatorState): void {
    this.store.changeRequestPager(event);
    this._initialLoad();
  }

  private _initialLoad(): void {
    const patronPid = this.store.currentPatron()?.pid;
    if (!patronPid) return;
    this.store.loadRequests(patronPid, this.store.requestPager().page, this.store.requestPager().rows).subscribe();
  }
}
