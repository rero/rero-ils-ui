/*
 * RERO ILS UI
 * Copyright (C) 2025 RERO
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

export const testRecordPermission = {
  create: {
    can: true
  },
  delete: {
    can: false
  },
  list: {
    can: true
  },
  read: {
    can: true
  },
  update: {
    can: true
  }
};

export const testRolesPermissions = {
  "allowed_roles": [
    "patron",
    "pro_read_only",
    "pro_acquisition_manager",
    "pro_catalog_manager",
    "pro_circulation_manager",
    "pro_library_administrator",
    "pro_user_manager",
    "pro_entity_manager",
    "pro_statistic_manager",
    "pro_full_permissions"
  ]
}
