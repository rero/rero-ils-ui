/*
 * RERO ILS UI
 * Copyright (C) 2023-2025 RERO
 * Copyright (C) 2023 UCLouvain
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
 * Convert a level string to primeng level
 * @param level - string: the level string to convert
 * @return the severity of message (info by default)
 */
export function getSeverity(level: string) {
  switch (level) {
    case 'error':
      return 'error';
    case 'warning':
      return 'warn';
    case 'debug':
      return 'secondary';
    default:
      return 'info';
  }
}
