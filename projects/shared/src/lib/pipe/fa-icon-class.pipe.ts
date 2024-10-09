/*
 * RERO ILS UI
 * Copyright (C) 2019-2024 RERO
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
  name: 'faIconClass',
})
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
