/*
 * RERO ILS UI
 * Copyright (C) 2021 RERO
 * Copyright (C) 2021 UCLouvain
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

// required as json properties is not lowerCamelCase

export class ExternalSourceSetting {
  key: string;
  label = "";
  weight?: number = 100;
  endpoint?: string;

  constructor(obj?: any) {
    Object.assign(this, obj)
  }

  /**
   * Get the import url to use
   * @return: the endpoint url to use to import external sources
   */
  getImportEndpoint(): string {
    return (this.endpoint != undefined)
      ? this.endpoint
      : `import_${this.key}`;
  }
}
