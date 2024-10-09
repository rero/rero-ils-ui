/*
 * RERO ILS UI
 * Copyright (C) 2021-2024 RERO
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
import { Component, inject, Input, OnInit } from '@angular/core';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { TranslateService } from '@ngx-translate/core';
import { ItemApiService } from '../../../api/item-api.service';
import { QueryResponse } from '../../../record';

@Component({
  selector: 'public-search-items',
  templateUrl: './items.component.html'
})
export class ItemsComponent implements OnInit {

  private itemApiService: ItemApiService = inject(ItemApiService);
  private translateService: TranslateService = inject(TranslateService);

  // COMPONENT ATTRIBUTES =====================================================
  /** Holding */
  @Input() holding: any;
  /** View code */
  @Input() viewcode: string;

  /** Items total */
  itemsTotal = 0;
  /** Page */
  page = 1;
  /** Items records */
  items = [];

  /** Items per page */
  private itemsPerPage = 10;

  // GETTER & SETTER ========================================================

  /**
   * Is the link `show more items` must be displayed
   * @return boolean
   */
  get isLinkShowMore() {
    return this.itemsTotal > 0 && ((this.page * this.itemsPerPage) < this.itemsTotal);
  }

  /**
   * Get the string to use when some items are still hidden.
   * @return string
   */
  get hiddenItems(): string {
    const count = this.itemsTotal - (this.page * this.itemsPerPage);
    if (count <= 0) {
      return '';
    }
    const linkText = (count > 1)
      ? _('{{ counter }} hidden items')
      : _('{{ counter }} hidden item');
    return this.translateService.instant(linkText, { counter: count });
  }

  ngOnInit(): void {
    this.loadItems();
  }

  // COMPONENT FUNCTIONS ==================================================
  /** Handler when 'show more items' link is clicked. */
  showMore() {
    this.page++;
    this.loadItems();
  }

  private loadItems(): void {
    this.itemApiService.getItemsByHoldingsAndViewcode(
      this.holding,
      this.viewcode,
      this.page,
      this.itemsPerPage
    ).subscribe((response: QueryResponse) => {
      this.itemsTotal = response.total.value;
      this.items = this.items.concat(response.hits);
    });
  }
}
