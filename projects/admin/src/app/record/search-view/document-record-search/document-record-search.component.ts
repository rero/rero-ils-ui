/*
 * RERO ILS UI
 * Copyright (C) 2019-2024 RERO
 * Copyright (C) 2021-2023 UCLouvain
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, version 3 of the License.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { Component, ChangeDetectionStrategy, computed, inject } from '@angular/core';
import { RecordSearchComponent, RecordSearchPageComponent, RecordSearchStore } from '@rero/ng-core';
import { DocumentAdvancedSearchComponent } from '../document-advanced-search.component';
import { AppStore } from '@rero/shared';

@Component({
  selector: 'admin-document-record-search',
  templateUrl: './document-record-search.component.html',
  imports: [RecordSearchComponent, DocumentAdvancedSearchComponent],
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

