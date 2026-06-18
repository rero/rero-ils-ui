// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { filter } from 'rxjs';

export function nonNullable<T>() {
  return filter((v: T | null | undefined) => v != null);
}

export function numberGreatThan(count: number) {
  return filter((v: number) => v > count);
}
