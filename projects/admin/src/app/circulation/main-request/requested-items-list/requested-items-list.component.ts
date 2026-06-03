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

import { Component, effect, input, output, ChangeDetectionStrategy} from '@angular/core';
import { Item } from '@app/admin/classes/items';
import { LoanState } from '@app/admin/classes/loans';
import { OpenCloseButtonComponent } from '@rero/shared';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { RequestedItemComponent } from '../requested-item/requested-item.component';
import { CardModule } from 'primeng/card';

@Component({
    selector: 'admin-circulation-requested-items-list',
    templateUrl: './requested-items-list.component.html',
    imports: [OpenCloseButtonComponent, TranslateDirective, RequestedItemComponent, TranslatePipe, CardModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RequestedItemsListComponent {

  // COMPONENT ATTRIBUTES ====================================================
  /** Item list */
  items = input<any[]>();

  /** event emit when a request is validated */
  requestValidated = output<string>();

  /** Is the item detail should be collapsed */
  isCollapsed = false;

  /** the know item barcode list */
  private knownItemBarcodes: string[] = null;

  constructor() {
    effect(() => {
      // track items changes to capture previously known barcodes
      const items = this.items();
      if (items) {
        this.knownItemBarcodes = items.map((item) => item.barcode);
      }
    });
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
