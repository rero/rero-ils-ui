/*
 * RERO ILS UI
 * Copyright (C) 2021 RERO
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
