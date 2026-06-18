// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'join',
    pure: false
})
export class JoinPipe implements PipeTransform {

  /**
   * Join all parts of an array as a string.
   * @param parts: string or string array
   * @param glue: string to use to join parts.
   * @return: the joined string
   */
  transform(parts: string | string[], glue = ' '): string {
    if (!Array.isArray(parts)) {
      parts = [parts];
    }
    return parts.map(part => part.toString()).join(glue);
  }
}
