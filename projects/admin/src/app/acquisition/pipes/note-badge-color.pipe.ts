// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Pipe, PipeTransform } from '@angular/core';
import { AcqNoteType, IAcqNote } from '../classes/common';

@Pipe({ name: 'noteBadgeColor' })
export class NoteBadgeColorPipe implements PipeTransform {

  /**
   * Get the color (class) to use to highlight a note.
   * @param note: the note to analyze
   * @return: the color/class (primeng) to use for the note.
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
