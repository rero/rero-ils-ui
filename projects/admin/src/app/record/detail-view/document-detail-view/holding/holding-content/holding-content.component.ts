/*
 * RERO ILS UI
 * Copyright (C) 2025 RERO
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
import { Component, inject, input, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Record, RecordService, RecordUiService } from '@rero/ng-core';

@Component({
  selector: 'admin-holding-content',
  standalone: false,
  templateUrl: './holding-content.component.html'
})
export class HoldingContentComponent implements OnInit, OnDestroy {
  private recordService: RecordService = inject(RecordService);
  private translateService: TranslateService = inject(TranslateService);
  private recordUiService: RecordUiService = inject(RecordUiService);

  holding = input.required<any>();
  isCurrentOrganisation = input.required<boolean>();

  holdingType: 'electronic' | 'serial' | 'standard';
  items: any = null;
  itemsRef: any;
  totalItemsCounter = 0;
  displayItemsCounter = 10;

  ngOnInit(): void {
    this.holdingType = this.holding().metadata.holdings_type;
    if (this.holdingType !== 'electronic') {
      this._loadItems();
    }
  }

  ngOnDestroy(): void {
    if (this.itemsRef != null) {
      this.itemsRef.unsubscribe();
    }
  }

  deleteItem(itemPid: string): void {
    this.recordUiService.deleteRecord('items', itemPid).subscribe(
      (success: boolean) => {
        if (success) {
          // Remove the corresponding item from the item list.
          // If after this delete operation, the list if empty, then we could remove the holding BUT
          // we don't need to call the backend because the holding should already be removed
          // by backend.
          this.items = this.items.filter((i: any) => itemPid !== i.metadata.pid);
        }
      }
    );
  }

  showMore(increment = 5) {
    this.displayItemsCounter += increment;
  }

  showMoreItemsCounter(itemType: string) {
    const messages = {
      issue: {
        singular: '{{ counter }} hidden issue',
        plural: '{{ counter }} hidden issues'
      },
      default: {
        singular: '{{ counter }} hidden item',
        plural: '{{ counter }} hidden items'
      }
    };
    const message = messages.hasOwnProperty(itemType) ? messages[itemType] : messages.default;
    const additionalItemCounter = this.totalItemsCounter - this.displayItemsCounter;
    return this.translateService.instant(
      (additionalItemCounter === 1) ? message.singular : message.plural,
      {counter: additionalItemCounter}
    );
  }

  private _loadItems(): void {
    let query = `holding.pid:${this.holding().metadata.pid}`;
    let sort = '';
    switch (this.holding().metadata.holdings_type) {
      case 'serial':
        query += ' AND -issue.status:(claimed OR deleted OR late)';
        sort = '-issue_sort_date';
        break;
      case 'standard':
        sort = 'enumeration_chronology';
        break;
    }
    this.itemsRef = this.recordService
      .getRecords('items', query, 1, RecordService.MAX_REST_RESULTS_SIZE, [], {}, {Accept: 'application/rero+json'}, sort)
      .subscribe((result: Record) => {
        this.items = (this.recordService.totalHits(result.hits.total) > 0) ? result.hits.hits : null;
        this.totalItemsCounter = this.recordService.totalHits(result.hits.total);
      });
  }
}
