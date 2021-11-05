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

/* tslint:disable */
// required as json properties is not lowerCamelCase

/** Class to describe a reference between two object */
export class ObjectReference {
  pid?: string;
  type?: string;
  $ref?: string;

  /**
   * Constructor
   * @param obj - the JSON parsed object to load.
   */
  constructor(obj?: any){
    Object.assign(this, obj);
    // Try to fill empty values based from `$ref`
    if (this.$ref && (this.pid === undefined || this.type === undefined)) {
      const parts = this.$ref.split('/');
      this.pid = parts.pop();
      this.type = parts.pop();
    }
  }
}
