// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'mainTitleRelation' })
export class MainTitleRelationPipe implements PipeTransform {

  /**
   * Extract main title for relation
   * @param value - array of title field
   * @returns the first main title with _text field
   */
  transform(value: any[]): string {
    const mainTitle = value.filter((title: any) => title.type === 'bf:Title');
    return mainTitle[0]._text;
  }
}
