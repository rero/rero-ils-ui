/*
 * RERO ILS UI
 * Copyright (C) 2019-2025 RERO
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

import { EntityType } from "../class/entity";

/** Minimal shape for an entity used across shared components (contribution, entity-link...).
 * Keep fields optional because backend may omit them. Add more fields if needed.
 */
export type EntityShape = {
  pid?: string;
  type?: EntityType; // e.g. 'bf:Person' | 'bf:Organisation'
  resource_type?: string; // e.g. 'person_entities'
  authorized_access_point?: string; // common label used by extractSourceField/entityLabel
  // any other dynamic fields
  [key: string]: unknown;
};
