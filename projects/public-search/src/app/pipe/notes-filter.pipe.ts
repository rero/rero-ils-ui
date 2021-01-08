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
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'notesFilter'
})
/**
 * This pipe allows to filter the notes by type by passing
 * a array of allowed types
 * Example: notes | notesFilter : ['general_note', etc]
 */
export class NotesFilterPipe implements PipeTransform {

  /**
   * Transform
   * @param notes - array of notes
   * @param authorizedType - array of authorized types
   */
  transform(notes: { type: string, content: string}[], authorizedType: any[]): { type: string, content: string}[] {
    return notes.filter(note => authorizedType.includes(note.type));
  }

}
