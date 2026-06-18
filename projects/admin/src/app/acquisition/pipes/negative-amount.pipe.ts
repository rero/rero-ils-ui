// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'negativeAmount' })
export class NegativeAmountPipe implements PipeTransform {

  transform(amount: number): number {
    return 0 - Math.abs(amount);
  }

}
