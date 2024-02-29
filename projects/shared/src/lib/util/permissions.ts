/*
 * RERO ILS UI
 * Copyright (C) 2019-2023 RERO
 * Copyright (C) 2019-2023 UCLouvain
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

export const PERMISSIONS = {
  // Acquisition accounts
  'ACAC_ACCESS': 'acac-access',
  'ACAC_CREATE': 'acac-create',
  'ACAC_SEARCH': 'acac-search',
  'ACAC_TRANSFER': 'acac-transfer',
  // Acquisition order lines
  'ACOL_ACCESS': 'acol-access',
  'ACOL_CREATE': 'acol-create',
  'ACOL_SEARCH': 'acol-search',
  // Acquisition orders
  'ACOR_ACCESS': 'acor-access',
  'ACOR_CREATE': 'acor-create',
  'ACOR_SEARCH': 'acor-search',
  // Acquisition receipts
  'ACRE_ACCESS': 'acre-access',
  'ACRE_CREATE': 'acre-create',
  'ACRE_SEARCH': 'acre-search',
  // Acquisition receipt lines
  'ACRL_ACCESS': 'acrl-access',
  'ACRL_CREATE': 'acrl-create',
  'ACRL_SEARCH': 'acrl-search',
  // Acquisition budgets
  'BUDG_ACCESS': 'budg-access',
  'BUDG_SEARCH': 'budg-search',
  // Circulation policies
  'CIPO_ACCESS': 'cipo-access',
  'CIPO_CREATE': 'cipo-create',
  'CIPO_SEARCH': 'cipo-search',
  // Circulation management
  'CIRC_ADMIN': 'access-circulation',
  // Collections
  'COLL_ACCESS': 'coll-access',
  'COLL_CREATE': 'coll-create',
  'COLL_SEARCH': 'coll-search',
  // Debug mode
  'DEBUG_MODE': 'can-use-debug-mode',
  // Documents
  'DOC_ACCESS': 'doc-access',
  'DOC_CREATE': 'doc-create',
  'DOC_SEARCH': 'doc-search',
  // Documents
  'FILE_ACCESS': 'file-access',
  'FILE_CREATE': 'file-create',
  'FILE_SEARCH': 'file-search',
  // Entities
  // Entities
  'LOCENT_ACCESS': 'locent-access',
  'LOCENT_CREATE': 'locent-create',
  'LOCENT_SEARCH': 'locent-search',
  // Holdings
  'HOLD_ACCESS': 'hold-access',
  'HOLD_CREATE': 'hold-create',
  'HOLD_SEARCH': 'hold-search',
  // ILL requests
  'ILL_ACCESS': 'illr-access',
  'ILL_CREATE': 'illr-create',
  'ILL_SEARCH': 'illr-search',
  // Issue management
  'ISSUE_MANAGEMENT': 'late-issue-management',
  // Items
  'ITEM_ACCESS': 'item-access',
  'ITEM_CREATE': 'item-create',
  'ITEM_SEARCH': 'item-search',
  // Item types
  'ITTY_ACCESS': 'itty-access',
  'ITTY_CREATE': 'itty-create',
  'ITTY_SEARCH': 'itty-search',
  // Libraries
  'LIB_ACCESS': 'lib-access',
  'LIB_CREATE': 'lib-create',
  'LIB_SEARCH': 'lib-search',
  // Locations
  'LOC_ACCESS': 'loc-access',
  'LOC_CREATE': 'loc-create',
  'LOC_SEARCH': 'loc-search',
  // Local fields
  'LOFI_ACCESS': 'lofi-access',
  'LOFI_CREATE': 'lofi-create',
  'LOFI_SEARCH': 'lofi-search',
  // Operation logs
  'OPLG_SEARCH': 'oplg-search',
  // Organisations search
  'ORG_ACCESS': 'org-access',
  'ORG_SEARCH': 'org-search',
  // Permission management
  'PERM_MANAGEMENT': 'permission-management',
  // Patrons
  'PTRN_ACCESS': 'ptrn-access',
  'PTRN_CREATE': 'ptrn-create',
  'PTRN_SEARCH': 'ptrn-search',
  // PatronTransaction
  'PTTR_ACCESS': 'pttr-access',
  'PTTR_CREATE': 'pttr-create',
  'PTTR_SEARCH': 'pttr-search',
  // Patron types
  'PTTY_ACCESS': 'ptty-access',
  'PTTY_CREATE': 'ptty-create',
  'PTTY_SEARCH': 'ptty-search',
  // Templates
  'TMPL_ACCESS': 'tmpl-access',
  'TMPL_CREATE': 'tmpl-create',
  'TMPL_SEARCH': 'tmpl-search',
  // Statistics Configuration
  'STAT_CFG_ACCESS': 'stat_cfg-access',
  'STAT_CFG_CREATE': 'stat_cfg-create',
  'STAT_CFG_SEARCH': 'stat_cfg-search',
  // Admin User interface access
  'UI_ACCESS': 'admin-ui-access',
  // Vendors
  'VNDR_ACCESS': 'vndr-access',
  'VNDR_CREATE': 'vndr-create',
  'VNDR_SEARCH': 'vndr-search',
};

// User with permission service
export enum PERMISSION_OPERATOR {
  AND = 'and',
  OR = 'or'
}

export interface IPermissions {
  [key: string]: string;
}
