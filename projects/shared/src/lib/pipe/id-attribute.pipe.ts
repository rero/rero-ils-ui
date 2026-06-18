// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'idAttribute' })
export class IdAttributePipe implements PipeTransform {

  /**
   * Transform
   * @param value - value
   * @param options - object
   * @param args - array
   * @return any or string
   */
  transform(value: any, options?: {prefix?: string|null, suffix?: string|null}, ..._args: any[]): any {
    // If no options, return only value
    if (!options) {
      return value;
    }

    let parts = [options.prefix || null, value, options.suffix || null];
    parts = parts.filter(v => v !== null);
    return parts.join('-');
  }
}
