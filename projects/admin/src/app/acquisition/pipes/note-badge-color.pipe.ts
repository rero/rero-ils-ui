/*
 * RERO ILS UI
 * Copyright (C) 2021 RERO
 * Copyright (C) 2021 UCLouvain
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
import { AcqNoteType, IAcqNote } from '../classes/common';

@Pipe({
  name: 'noteBadgeColor'
})
export class NoteBadgeColorPipe implements PipeTransform {

  /**
   * Get the color (class) to use to highlight a note.
   * @param note: the note to analyze
   * @return: the color/class (bootstrap) to use for the note.
   */
  transform(note: IAcqNote): string {
    switch (note.type) {
      case AcqNoteType.STAFF_NOTE: return 'info';
      case AcqNoteType.VENDOR_NOTE: return 'warning';
      case AcqNoteType.RECEIPT_NOTE: return 'primary';
      default: return 'secondary';
    }
  }

}
