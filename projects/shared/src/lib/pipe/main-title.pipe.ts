// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'mainTitle' })
export class MainTitlePipe implements PipeTransform {

  /**
   * extract the main title from document metadata
   * @param titleMetadata:  the document title metadata (as `getRecord` response with resolve=1)
   * @return string: the document main title or null if no title found.
   */
  transform(titleMetadata: any): string | null {
    if (titleMetadata == null) {
      return null;
    }
    const mainTitles: any[] = titleMetadata.filter(title => title.type === 'bf:Title');
    return (mainTitles.length > 0)
      ? mainTitles.pop()._text
      : null;
  }
}
