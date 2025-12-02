/*
 * RERO ILS UI
 * Copyright (C) 2021-2025 RERO
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
import { Component, inject } from '@angular/core';
import { HistoriesStore } from '../store/histories-store';

@Component({
  selector: 'public-search-patron-profile-histories',
  templateUrl: './patron-profile-histories.component.html',
  standalone: false
})
export class PatronProfileHistoriesComponent {

  private historiesStore = inject(HistoriesStore);

  /** history records */
  records = this.historiesStore.history;

  /** loading state */
  loading = this.historiesStore.historyLoading;

  /** has more records */
  hasMore = this.historiesStore.hasMore;

  /** Load more history */
  loadMore(): void {
    this.historiesStore.loadMore();
  }
}
