// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * Format a patron's display name as "last_name, first_name".
 * @param patron - object with optional last_name and first_name properties
 */
export function formatPatronName(patron: { last_name?: string; first_name?: string }): string {
  return [
    patron.last_name || null,
    patron.first_name || null
  ]
    .filter(el => el !== null)
    .map(el => el.trim())
    .join(', ');
}
