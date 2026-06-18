// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'marc' })
export class MarcPipe implements PipeTransform {

  transform(value: any): any {
    const values: any = {};

    const field: string = value[0];
    const subFields: string|any[] = value[1];
    let subFieldsStr = subFields;
    if (field.length === 6 && field !== 'leader') {
      const f = field.substring(0, 3);
      let ind1 = field.substring(4, 5);
      if (!ind1) {
        ind1 = ' ';
      }
      let ind2 = field.substring(5, 6);
      if (!ind2) {
        ind2 = ' ';
      }
      values.ind1 = ind1;
      values.ind2 = ind2;
      values.field = f;
    } else {
      values.field = field;
    }
    if (Array.isArray(subFields)) {
      subFieldsStr = '';
      for (const f of subFields) {
        subFieldsStr += `$${f[0]} ${f[1]} `;
      }
      subFieldsStr = subFieldsStr.trim();
    }
    values.value = subFieldsStr;
    return values;
  }

}
