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
      return 'fa-file-o';
    }
    switch (true) {
      case mimetype.startsWith('image/'):
        return 'fa-file-image-o';
      case mimetype.startsWith('audio/'):
        return 'fa-file-audio-o';
      case mimetype.startsWith('text/'):
        return 'fa-file-text-o';
      case mimetype.startsWith('video/'):
        return 'fa-file-video-o';
      case mimetype.startsWith('application/vnd.openxmlformats-officedocument.presentationml'):
        return 'fa-file-powerpoint-o';
      case mimetype.startsWith('application/vnd.openxmlformats-officedocument.wordprocessingml'):
        return 'fa-file-word-o';
      case mimetype.startsWith('application/vnd.openxmlformats-officedocument.spreadsheetml'):
        return 'fa-file-excel-o';
      case mimetype.startsWith('application/pdf'):
        return 'fa-file-pdf-o';
    }
    return 'fa-file-o';
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
