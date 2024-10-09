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
import { ObjectReference } from '@rero/shared';

/** Wrapping class to describe an AcqAccount */
export class AcqBudget {
  $schema: string = null;
  pid: string = null;
  name: string = '';
  start_date: string = '';
  end_date: string = '';
  is_active: boolean = false;
  organisation: ObjectReference;

  /**
   * Constructor
   * @param obj - the JSON parsed object to load.
   */
  constructor(obj?: any) {
    Object.assign(this, obj);
  }
}
