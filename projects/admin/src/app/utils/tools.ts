/*
 * RERO ILS UI
 * Copyright (C) 2019-2023 RERO
 * Copyright (C) 2019-2023 UCLouvain
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

export class Tools {
  /**
   * Generate entity search query
   * @param catalogKey - Catalog key (Ex: idref, gnd, rero)
   * @param catalogPid - Entity catalog pid
   * @returns The string representing the query
   */
  static generateEntitySearchQuery(catalogKey: string, catalogPid: string): string {
    const queries = [];
    ['contribution', 'subjects', 'genreForm'].every(
      (field: string) => queries.push(`${field}.entity.pids.${catalogKey}:${catalogPid}`)
    );

    return queries.join(' OR ');
  }
}
