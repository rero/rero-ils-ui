/*
 * RERO ILS UI
 * Copyright (C) 2019-2026 RERO
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, version 3 of the License.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

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
