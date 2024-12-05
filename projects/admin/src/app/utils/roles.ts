/*
 * RERO ILS UI
 * Copyright (C) 2019-2022 RERO
 * Copyright (C) 2019-2022 UCLouvain
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

export enum ROLES_TAG_SEVERITY {
  patron = 'primary',
  pro_full_permissions = 'danger',
  pro_read_only = 'help',
  pro_catalog_manager = 'success',
  pro_circulation_manager = 'warning',
  pro_user_manager = 'info',
  pro_acquisition_manager = 'secondary',
  pro_library_administrator = 'contrast'
}

export function roleTagSeverity(role: string): string {
  return (role in ROLES_TAG_SEVERITY)
    ? ROLES_TAG_SEVERITY[role]
    : 'secondary';
}
