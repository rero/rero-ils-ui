/*
 * RERO ILS UI
 * Copyright (C) 2019-2024 RERO
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

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Item } from '@app/admin/classes/items';
import { LoanState } from '@app/admin/classes/loans';

@Component({
    selector: 'admin-circulation-requested-items-list',
    templateUrl: './requested-items-list.component.html',
    standalone: false
})
export class RequestedItemsListComponent implements OnChanges {

  // COMPONENT ATTRIBUTES ====================================================
  /** Item list */
  @Input() items: any[];

  /** event emit when a request is validated */
  @Output() requestValidated = new EventEmitter();

  /** Is the item detail should be collapsed */
  isCollapsed: boolean = false;

  /** the know item barcode list */
  private knownItemBarcodes: Array<string> = null;

  // CONSTRUCTOR & HOOKS ====================================================
  /**
   * OnChanges hook
   * @param changes: the changed properties.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty('items') && !changes.items.firstChange && changes.items.previousValue) {
      this.knownItemBarcodes = changes.items.previousValue.map((item) => item.barcode);
    }
  }

  // COMPONENT FUNCTIONS ====================================================
  /**
   * Get the callout css class for the item.
   * If the item is new is new the list, then we would add a display indication about this fact
   * @param item - Item : the item to check
   * @return the css class to use as callout
   */
  getItemCallout(item: Item): string {
    if (item.loan.state !== LoanState.PENDING) {
      return 'callout-success callout-bg-success';
    }
    return (this.knownItemBarcodes && !this.knownItemBarcodes.includes(item.barcode))
      ? 'callout-warning callout-bg-warning'
      : null;
  }

  /** when a request from the list is validated */
  validateRequest(itemBarcode: string) {
    this.requestValidated.emit(itemBarcode);
  }
}
