// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'documentProvisionActivity' })
export class DocumentProvisionActivityPipe implements PipeTransform {

  /**
   * Process provision activity field
   * @param provisionActivity - provision activity data
   * @returns Object
   */
  transform(provisionActivity: any): object {
    if (undefined === provisionActivity) {
      return [];
    }
    const results = {};
    provisionActivity
      .filter((element: any) => '_text' in element && 'statement' in element)  // Keep only element with '_text'
      .map((element: any) => {
        const { type } = element;
        if (!(type in results)) {  // if type isn't yet init
          results[type] = [];
        }
        element._text.map((e: { language: string, value: string }) => results[type].push(e.value));
      });
    return results;
  }
}
