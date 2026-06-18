// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Pipe, PipeTransform } from '@angular/core';

/**
 * This pipe allows to filter the notes by type by passing
 * a array of allowed types
 * Example: notes | notesFilter : ['general_note', etc]
 */

@Pipe({ name: 'notesFilter' })
export class NotesFilterPipe implements PipeTransform {

  /**
   * Transform
   * @param notes - array of notes
   * @param authorizedType - array of authorized types
   */
  transform(notes: { type: string, content: string}[], authorizedType: string[]): { type: string, content: string}[] {
    return (notes && notes.length > 0)
      ? notes.filter(note => authorizedType.includes(note.type))
      : [];
  }

}
