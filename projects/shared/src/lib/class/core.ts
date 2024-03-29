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

/**
 * Interface to describe an internal resource reference
 * Either the `pid` and `type` is available, either the `$ref`.
 * TODO :: It should be possible to compute $ref from pid/type and reversely */
export interface ObjectReference {
  pid?: string;
  type?: string;
  $ref?: string;
}

/** Interface to describe an `Organisation` resource */
export interface Organisation {
  $schema: string;
  pid: string;
  name: string;
  code: string;
  address?: string;
  default_currency: string;
  current_budget_pid?: string;
  online_harvested_source?: string;
  collection_enabled_on_public_view?: boolean;
}
