// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

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
