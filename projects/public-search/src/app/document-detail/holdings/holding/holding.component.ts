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
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'public-search-holding',
  templateUrl: './holding.component.html',
  styles: ['a.collapse-link i { min-width: 16px}']
})
export class HoldingComponent {

  // COMPONENT ATTRIBUTES =====================================================
  /** Holdings record */
  @Input() holding: any;
  /** View code */
  @Input() viewcode: string;
  /** Is collapsed holdings */
  @Input() isCollapsed = true;

  /** Items count */
  itemsCount = 0;
  /** Authorized types of note */
  noteAuthorizedTypes: string[] = ['general_note'];

  // GETTER & SETTER ==========================================================
  /** Current interface language */
  get language() {
    return this._translateService.currentLang;
  }

  // CONSTRUCTOR & HOOKS ======================================================
  /**
   * Constructor
   * @param _translateService - TranslateService
   */
  constructor(private _translateService: TranslateService) {}


  // COMPONENT FUNCTIONS ======================================================
  /**
   * Handler to manage event items count emitter
   * @param event - number : the number of items for this holding
   */
  eItemsCount(event: number): void {
    this.itemsCount = event;
  }


}
