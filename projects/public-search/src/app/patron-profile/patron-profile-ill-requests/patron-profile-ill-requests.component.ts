// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { ChangeDetectionStrategy, Component, effect, inject, untracked } from '@angular/core';
import { TranslateDirective } from "@ngx-translate/core";
import { PaginatorComponent } from '@rero/shared';
import { PanelModule } from 'primeng/panel';
import { PaginatorState } from 'primeng/paginator';
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

  constructor() {
    effect(() => {
      this.store.currentPatron();
      untracked(() => {
        this.store.resetIllRequests();
        if (this.store.activeTab() === 'illRequest') this._initialLoad();
      });
    });
    effect(() => {
      if (this.store.activeTab() === 'illRequest') {
        untracked(() => this._initialLoad());
      }
    });
  }

  onPageChange(event: PaginatorState): void {
    this.store.changeIllRequestsPager(event);
    this._initialLoad();
  }

  private _initialLoad(): void {
    const patronPid = this.store.currentPatron()?.pid;
    if (!patronPid) return;
    this.store.loadIllRequests(patronPid, this.store.illRequestsPager().page, this.store.illRequestsPager().rows).subscribe();
  }
}
