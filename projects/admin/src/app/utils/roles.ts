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

export enum ROLES_BAGDE_COLOR {
  patron = 'badge-primary',
  pro_full_permissions = 'badge-danger',
  pro_read_only = 'badge-secondary',
  pro_catalog_manager = 'badge-success',
  pro_circulation_manager = 'badge-warning',
  pro_user_manager = 'badge-info',
  pro_acquisition_manager = 'badge-light',
  pro_library_administrator = 'badge-dark'
}

export function roleBadgeColor(role: string): string {
  return (role in ROLES_BAGDE_COLOR)
    ? ROLES_BAGDE_COLOR[role]
    : 'badge-light';
}
