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
import { Component, Input } from '@angular/core';

@Component({
  selector: 'public-search-holding',
  templateUrl: './holding.component.html'
})
export class HoldingComponent {

  /** Holdings record */
  @Input() holding: any;
  /** View code */
  @Input() viewcode: string;

  /** Is collapsed holdings */
  isCollapsed = false;
  /** Items count */
  itemsCount = 0;
  /** Authorized types of note */
  noteAuthorizedTypes: string[] = [
    'general_note'
  ];

  /**
   * Event items count
   * @param event - number
   */
  eItemsCount(event: number): void {
    this.itemsCount = event;
  }


}
