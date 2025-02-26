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
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'notesFormat',
    standalone: false
})
export class NotesFormatPipe implements PipeTransform {

  transform(notes: any): any {
    if (notes) {
      const notesText = {};
      for (const note of notes) {
        if (!(note.noteType in notesText)) {
          notesText[note.noteType] = [note.label];
        } else {
          notesText[note.noteType].push(note.label);
        }
      }
      return notesText;
    }
    return null;

  }
}
