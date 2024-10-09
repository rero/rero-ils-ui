/*
 * RERO ILS UI
 * Copyright (C) 2019-2024 RERO
 * Copyright (C) 2019-2023 UCLouvain
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
import { Component, inject, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HoldingsNoteType } from '@rero/shared';

@Component({
  selector: 'public-search-holding',
  templateUrl: './holding.component.html',
  styleUrls: ['./holding.component.scss']
})
export class HoldingComponent {

  private translateService: TranslateService = inject(TranslateService);

  // COMPONENT ATTRIBUTES =====================================================
  /** Holdings record */
  @Input() holding: any;

  /** View code */
  @Input() viewcode: string;

  /** Is collapsed holdings */
  @Input() collapsed = true;

  /** Authorized types of note */
  noteAuthorizedTypes: string[] = [HoldingsNoteType.GENERAL, HoldingsNoteType.ACCESS];

  /** Request dialog */
  requestDialog = false;

  // GETTER & SETTER ==========================================================
  /** Current interface language */
  get language() {
    return this.translateService.currentLang;
  }
}
