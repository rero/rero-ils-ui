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
import { Component, Input, OnInit } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ItemService } from '../../api/item.service';

@Component({
  selector: 'public-search-book',
  templateUrl: './book.component.html'
})
export class BookComponent implements OnInit {

  /** Document pid */
  @Input() documentpid: string;

  /** View code */
  @Input() viewcode: string;

  /** Holdings per page */
  private itemsPerPage = 4;

  /** Page */
  page = 1;

  /** Array of items */
  items: any[];

  /** Items count */
  itemsTotal = 0;

  /**
   * Constructor
   * @param _itemService - ItemService
   */
  constructor(private _itemService: ItemService) {}

  /** OnInit hook */
  ngOnInit(): void {
    const totalObservable = this._itemService
      .getItemsTotalByDocumentPidAndViewcode(this.documentpid, this.viewcode);
    forkJoin([totalObservable, this._itemsQuery(1)]).subscribe((results: any[]) => {
      this.itemsTotal = results[0];
      this.items = results[1];
    });
  }

  /**
   * Is link show more
   * @return boolean
   */
  get isLinkShowMore() {
    return this.itemsTotal > 0
      && ((this.page * this.itemsPerPage) < this.itemsTotal);
  }

  /** Show more */
  showMore() {
    this.page++;
    this._itemsQuery(this.page).subscribe((holdings: any[]) => {
      this.items = this.items.concat(holdings);
    });
  }

  /**
   * Items query
   * @param page - number
   * @return Observable
   */
  private _itemsQuery(page: number): Observable<any> {
    return this._itemService
      .getItemsByDocumentPidAndViewcode(this.documentpid, this.viewcode, page, this.itemsPerPage)
      .pipe(map((response: any) => {
        return response.hits.hits;
      }));
  }
}
