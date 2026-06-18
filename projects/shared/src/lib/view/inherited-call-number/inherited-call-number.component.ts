// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Component, OnInit, input, ChangeDetectionStrategy} from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { ItemHoldingsCallNumberPipe } from '../../pipe/item-holdings-call-number.pipe';

@Component({
    selector: 'shared-inherited-call-number',
    templateUrl: './inherited-call-number.component.html',
    imports: [AsyncPipe, TranslatePipe, ItemHoldingsCallNumberPipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InheritedCallNumberComponent implements OnInit {

  /** Current item */
  readonly item = input<any>(undefined);

  /** context
   * first to return the first call number
   * by default to return the concatenated first and second call number
   */
  readonly context = input<string>(undefined);

  /** Item metadata */
  itemMetadata: any;

  ngOnInit(): void {
    const item = this.item();
    if (item) {
      this.itemMetadata = ('metadata' in item)
      ? this.itemMetadata = item.metadata
      : this.itemMetadata = item;
    }
  }
}
