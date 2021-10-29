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

/* tslint:disable */
// required as json properties is not lowerCamelCase

// CLASSES ====================================================================
/** Base class for Acquisition resource */
export abstract class AcqBaseResource {

  notes: AcqNote[] = [];

  /**
   * Search about a specific note for this object
   * @param noteType: the note type to search.
   * @return: the corresponding note or `null` if no note can be found.
   */
  getNote(noteType: AcqNoteType): AcqNote | null {
    return this.notes.filter(note => note.type === noteType).shift();
  }

  /**
   * Get the color (class) to use to highlight a note.
   * @param note: the note to analyze
   * @return: the color/class (boostrap) to use for the note.
   */
  getNoteColor(note: AcqNote): string {
    switch (note.type) {
      case AcqNoteType.STAFF_NOTE: return 'info';
      case AcqNoteType.VENDOR_NOTE: return 'warning';
      default: return 'secondary';
    }
  }
}

// INTERFACES =================================================================
/** Enumeration of possible note type */
export enum AcqNoteType {
  STAFF_NOTE = 'staff_note',
  VENDOR_NOTE = 'vendor_note'
}

/** Interface to describe an order note */
export interface AcqNote {
  type: AcqNoteType;
  content: string;
}
