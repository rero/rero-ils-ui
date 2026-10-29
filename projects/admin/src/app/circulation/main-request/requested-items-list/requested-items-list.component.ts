// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Component, effect, input, output } from '@angular/core';
import { Item } from '@app/admin/classes/items';
import { LoanState } from '@app/admin/classes/loans';
import { TranslatePipe } from '@ngx-translate/core';
import { CardModule } from '@openng/optimus-ui/card';
import { OpenCloseButtonComponent } from '@rero/shared';

import { RequestedItemComponent } from '../requested-item/requested-item.component';

@Component({
  selector: 'admin-circulation-requested-items-list',
  templateUrl: './requested-items-list.component.html',
  imports: [OpenCloseButtonComponent, RequestedItemComponent, TranslatePipe, CardModule],
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
    return this.knownItemBarcodes && !this.knownItemBarcodes.includes(item.barcode)
      ? 'callout-warning callout-bg-warning'
      : null;
  }

  /** when a request from the list is validated */
  validateRequest(itemBarcode: string) {
    this.requestValidated.emit(itemBarcode);
  }
}
