/*
 * RERO ILS UI
 * Copyright (C) 2022 UCLouvain
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
import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { ItemsService } from '../service/items.service';

@Pipe({
  name: 'itemAvailability'
})
export class ItemAvailabilityPipe implements PipeTransform {

  /**
   * Constructor
   * @param _itemService - ItemService
   */
  constructor(
    private _itemService: ItemsService
  ) { }

  /**
   * Get the availability about an item
   * @param itemPid - The item pid
   * @returns An observable representing the item availability
   */
  transform(itemPid: string): Observable<boolean> {
    return this._itemService.getAvailability(itemPid);
  }

}
