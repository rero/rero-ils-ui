// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Component, ChangeDetectionStrategy, computed, inject } from '@angular/core';
import { RecordSearchComponent, RecordSearchPageComponent, RecordSearchStore } from '@rero/ng-core';
import { TranslateDirective } from '@ngx-translate/core';
import { DocumentAdvancedSearchComponent } from '../document-advanced-search.component';
import { AppStore } from '@rero/shared';

@Component({
  selector: 'admin-document-record-search',
  templateUrl: './document-record-search.component.html',
  imports: [RecordSearchComponent, DocumentAdvancedSearchComponent, TranslateDirective],
  providers: [RecordSearchStore],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocumentRecordSearchComponent extends RecordSearchPageComponent {

  private readonly appStore = inject(AppStore);

  showLink = computed(() => this.store.total() === 0
    && this.store.q()
    && this.store.aggregationsFilters().some((a) => a.key === 'organisation')
  );

  get isAdvancedSearchEnable(): boolean {
    return this.appStore.settings().documentAdvancedSearch
      && this.store.hasFilter('simple', '0');
  }

  linkToGlobalDocuments(event: PointerEvent): void {
    event.preventDefault();
    this.store.updatePage(1);
    this.store.removeFilter('organisation');
  }
}

