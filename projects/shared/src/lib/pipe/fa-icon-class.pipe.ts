// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'faIconClass' })
export class FaIconClassPipe implements PipeTransform {

  /**
   * Get the font awesome class name for a given mime type.
   *
   * @param mimetype mime type of a file
   * @returns the font awesome class
   */
  faClassForMimeType(mimetype: string): string {
    if (mimetype == null) {
      return 'fa-regular fa-file';
    }
    switch (true) {
      case mimetype.startsWith('image/'):
        return 'fa-regular fa-file-image';
      case mimetype.startsWith('audio/'):
        return 'fa-regular fa-file-audio';
      case mimetype.startsWith('text/'):
        return 'fa-regular fa-file-lines';
      case mimetype.startsWith('video/'):
        return 'fa-regular fa-file-video';
      case mimetype.startsWith('application/vnd.openxmlformats-officedocument.presentationml'):
        return 'fa-regular fa-file-powerpoint';
      case mimetype.startsWith('application/vnd.openxmlformats-officedocument.wordprocessingml'):
        return 'fa-regular fa-file-word';
      case mimetype.startsWith('application/vnd.openxmlformats-officedocument.spreadsheetml'):
        return 'fa-regular fa-file-excel';
      case mimetype.startsWith('application/pdf'):
        return 'fa-regular fa-file-pdf';
    }
    return 'fa-regular fa-file';
  }

  /**
   * Get the font awesome class given a type and a value.
   *
   * @param value the value corresponding to the icon
   * @param type type of the icon i.e. file
   * @returns the font awesome classes.
   */
  transform(value: string, type: string): string | null {
    switch(type) {
      case 'file':
        return this.faClassForMimeType(value);
    }
    return null;
  }
}
