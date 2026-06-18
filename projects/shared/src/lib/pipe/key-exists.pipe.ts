// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'keyExists' })
export class KeyExistsPipe implements PipeTransform {

  transform(data: object, field: string): boolean {
    return Object.hasOwn(data, field);
  }

}
