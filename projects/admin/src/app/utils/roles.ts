// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later

export enum ROLES_TAG_SEVERITY {
  patron = 'primary',
  pro_full_permissions = 'danger',
  pro_read_only = 'help',
  pro_catalog_manager = 'success',
  pro_circulation_manager = 'warn',
  pro_user_manager = 'info',
  pro_acquisition_manager = 'secondary',
  pro_library_administrator = 'contrast'
}

export function roleTagSeverity(role: string): string {
  return (role in ROLES_TAG_SEVERITY)
    ? ROLES_TAG_SEVERITY[role]
    : 'secondary';
}
