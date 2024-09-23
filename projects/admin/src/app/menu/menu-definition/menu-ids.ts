/*
 * RERO ILS UI
 * Copyright (C) 2024 RERO
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
export const MENU_IDS = {
  APP: {
    ACQUISITION: {
      MENU: 'app-acquisition-menu',
      ACCOUNT: 'app-acquisition-account',
      BUDGET: 'app-acquisition-budget',
      LATE_ISSUE: 'app-acquisition-late-issue',
      ORDER: 'app-acquisition-order',
      VENDOR: 'app-acquisition-vendor',
    },
    ADMIN: {
      MENU: 'app-admin-menu',
      CIRCULATION_POLICY: 'app-admin-circulation-policy',
      ITEM_TYPE: 'app-admin-item-type',
      LIBRARY: 'app-admin-library',
      MY_LIBRARY: 'app-admin-library',
      MY_ORGANISATION: 'app-admin-organisation',
      PATRON_TYPE: 'app-admin-patron-type',
      PERMISSION: 'app-admin-permission',
      TEMPLATE: 'app-admin-template',
    },
    CATALOG: {
      MENU: 'app-catalog-menu',
      DOCUMENT: 'app-catalog-document',
      DOCUMENT_ADD: 'app-catalog-document-add',
      DOCUMENT_LIST: 'app-catalog-document-list',
      ENTITY: 'app-catalog-entity',
      IMPORT: 'app-catalog-import',
    },
    REPORT_MONITORING: {
      MENU: 'app-report-monitoring-menu',
      FEE: 'app-report-monitoring-fee',
      INVENTORY: 'app-report-monitoring-inventory',
      STAT_CONFIG: 'app-report-monitoring-stat-config',
    },
    USER: {
      MENU: 'app-user-services',
      CIRCULATION: 'app-user-services-circulation',
      COLLECTION: 'app-user-collection',
      CURRENT_LOANS: 'app-user-current-loans',
      ILL: 'app-user-ill',
      REQUEST: 'app-user-request',
      USERS: 'app-user-users',
    }
  },

  LIBRARY_MENU: 'library-menu',

  USER: {
    MENU: 'user-user',
    HELP: 'user-help',
    LANGUAGE: 'user-language',
    LOGOUT: 'user-logout',
    PUBLIC_INTERFACE: 'user-public-interface',
  }
};
