/*
 * RERO ILS UI
 * Copyright (C) 2019 RERO
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

import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { RecordService } from '@rero/ng-core';

@Component({
  selector: 'admin-document-holding',
  templateUrl: './holding.component.html',
  styles: ['./holding.component.css']
})
export class HoldingComponent implements OnInit, OnDestroy {

  /** Holding record */
  @Input() holding: any;

  /** Document harvested */
  @Input() harvested: boolean;

  /** Items */
  items: any;

  /** Items observable reference */
  itemsRef: any;

  /** Items collapsed */
  isItemsCollapsed = false;

  constructor(
    private recordService: RecordService
  ) { }

  ngOnInit() {
    if (!this.harvested) {
      this.loadItems(this.holding.metadata.pid);
    }
  }

  ngOnDestroy() {
    if (this.itemsRef != null) {
      this.itemsRef.unsubscribe();
    }
  }

  toggleCollapse() {
    if (this.isItemsCollapsed) {
      this.loadItems(this.holding.metadata.pid);
    }
    this.isItemsCollapsed = !this.isItemsCollapsed;
  }

  deleteItem(itemPid: Event) {
    this.items = this.items.filter((item: any) => itemPid !== item.metadata.pid);
  }

  private loadItems(holdingPid: string) {
    const query = `holding.pid:${holdingPid}`;
    this.itemsRef = this.recordService
      .getRecords('items', query, 1, RecordService.MAX_REST_RESULTS_SIZE)
      .subscribe(result => {
        if (result.hits.total > 0) {
          this.items = result.hits.hits;
        }
    });
  }
}
