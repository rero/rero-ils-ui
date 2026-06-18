// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'default' })
export class DefaultPipe implements PipeTransform {
  transform(value: any, defaultValue: any = ''): any {
    return (value === null || value === undefined) ? defaultValue : value;
  }
}
