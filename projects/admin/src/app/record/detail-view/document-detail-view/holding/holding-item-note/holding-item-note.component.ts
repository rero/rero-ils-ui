/*
 * RERO ILS UI
 * Copyright (C) 2020 RERO
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
import { ItemNote } from 'projects/admin/src/app/classes/items';

@Component({
  selector: 'admin-holding-item-note',
  template: `
    <div class="row" *ngIf="note">
      <div class="col-4 font-weight-bold label-title pl-5">{{ note.type.toString() | translate}}</div>
      <div class="col-8" [innerHTML]="note.content"></div>
    </div>
  `
})
export class HoldingItemNoteComponent {
  /** the item note */
  @Input() note: ItemNote;
}
