/*
 * RERO ILS UI
 * Copyright (C) 2019-2024 RERO
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
import { PERMISSIONS, PERMISSION_OPERATOR } from "@rero/shared";
import { MenuItem } from "primeng/api";
import { MENU_IDS } from "./menu-ids";

export const MENU_APP: MenuItem[] = [
  /** USER MENU */
  {
    name: 'User services',
    translateLabel: 'User services',
    id: MENU_IDS.APP.USER.MENU,
    icon: 'fa fa-users',
    items: [
      {
        name: 'Checkout/checkin',
        translateLabel: 'Checkout/checkin',
        id: MENU_IDS.APP.USER.CIRCULATION,
        icon: 'fa fa-exchange',
        router_link: ['/', 'circulation'],
        shortcut: 'c',
        access: {
          permissions: [PERMISSIONS.CIRC_ADMIN]
        }
      },
      {
        label: 'Requests',
        translateLabel: 'Requests',
        id: MENU_IDS.APP.USER.REQUEST,
        icon: 'fa fa-shopping-basket',
        routerLink: ['/', 'circulation', 'requests'],
        shortcut: 'r',
        access: {
          permissions: [PERMISSIONS.CIRC_ADMIN]
        }
      },
      {
        label: 'ILL requests',
        translateLabel: 'ILL requests',
        id: MENU_IDS.APP.USER.ILL,
        icon: 'fa fa-truck',
        routerLink: ['/', 'records', 'ill_requests'],
        queryParams: {
          q: '',
          page: '1',
          size: '10',
          simple: '1',
          library: '$currentLibrary'
        },
        access: {
          permissions: [PERMISSIONS.ILL_ACCESS]
        }
      },
      {
        label: 'Users',
        translateLabel: 'Users',
        id: MENU_IDS.APP.USER.USERS,
        icon: 'fa fa-users',
        routerLink: ['/', 'records', 'patrons'],
        queryParams: {
          q: '',
          page: '1',
          size: '10',
          simple: '1'
        },
        shortcut: 'p',
        access: {
          permissions: [PERMISSIONS.PTRN_ACCESS]
        }
      },
      {
        label: 'Exhibition/course',
        translateLabel: 'Exhibition/course',
        id: MENU_IDS.APP.USER.COLLECTION,
        icon: 'fa fa-graduation-cap',
        routerLink: ['/', 'records', 'collections'],
        queryParams: {
          q: '',
          page: '1',
          size: '10',
          sort: 'title',
          simple: '1',
          library: '$currentLibrary'
        },
        access: {
          permissions: [PERMISSIONS.COLL_ACCESS]
        }
      },
      {
        label: 'Current loans',
        translateLabel: 'Current loans',
        id: MENU_IDS.APP.USER.CURRENT_LOANS,
        icon: 'fa fa-list-ul',
        routerLink: ['/', 'records', 'loans'],
        queryParams: {
          q: '',
          page: '1',
          size: '10',
          simple: '1',
          owner_library: '$currentLibrary'
        },
        access: {
          permissions: [PERMISSIONS.CIRC_ADMIN]
        }
      }
    ]
  },
  /** CATALOG MENU */
  {
    label: 'Catalog',
    translateLabel: 'Catalog',
    id: MENU_IDS.APP.CATALOG.MENU,
    icon: 'fa fa-book',
    items: [
      {
        label: 'Documents',
        translateLabel: 'Documents',
        id: MENU_IDS.APP.CATALOG.DOCUMENT,
        icon: 'fa fa-file-o',
        routerLink: ['/', 'records', 'documents'],
        queryParams: {
          q: '',
          page: '1',
          size: '10',
          simple: '1',
          organisation: '$currentOrganisation'
        },
        access: {
          permissions: [
            PERMISSIONS.DOC_ACCESS,
            PERMISSIONS.DOC_SEARCH
          ],
          operator: PERMISSION_OPERATOR.AND
        }
      },
      {
        label: 'Create a bibliographic record',
        translateLabel: 'Create a bibliographic record',
        id: MENU_IDS.APP.CATALOG.DOCUMENT_ADD,
        icon: 'fa fa-plus-square',
        routerLink: ['/', 'records', 'documents', 'new'],
        access: {
          permissions: [PERMISSIONS.DOC_CREATE]
        }
      },
      {
        label: 'Import from the web',
        translateLabel: 'Import from the web',
        id: MENU_IDS.APP.CATALOG.IMPORT,
        icon: 'fa fa-cloud-download',
        routerLink: ['/', 'records', 'import_bnf'],
        queryParams: {
          q: '',
          page: '1',
          size: '10'
        },
        access: {
          permissions: [PERMISSIONS.DOC_CREATE]
        }
      },
      {
        label: 'Entities',
        translateLabel: 'Entities',
        id: MENU_IDS.APP.CATALOG.ENTITY,
        icon: 'fa fa-cubes',
        routerLink: ['/', 'records', 'entities'],
        queryParams: {
          q: '',
          page: '1',
          size: '10'
        }
      }
    ]
  },
  /** ACQUISITION MENU */
  {
    label: 'Acquisitions',
    translateLabel: 'Acquisitions',
    id: MENU_IDS.APP.ACQUISITION.MENU,
    icon: 'fa fa-university',
    items: [
      {
        label: 'Vendors',
        translateLabel: 'Vendors',
        id: MENU_IDS.APP.ACQUISITION.VENDOR,
        icon: 'fa fa-briefcase',
        routerLink: ['/', 'records', 'vendors'],
        queryParams: {
          q: '',
          page: '1',
          size: '10',
          sort: 'name_asc',
          simple: '1'
        },
        access: {
          permissions: [PERMISSIONS.VNDR_ACCESS]
        }
      },
      {
        label: 'Orders',
        translateLabel: 'Orders',
        id: MENU_IDS.APP.ACQUISITION.ORDER,
        icon: 'fa fa-shopping-cart',
        routerLink: ['/', 'records', 'acq_orders'],
        queryParams: {
          q: '',
          page: '1',
          size: '10',
          library: '$currentLibrary',
          budget: '$currentBudget',
          simple: '1',
        },
        access: {
          permissions: [PERMISSIONS.ACOR_ACCESS]
        }
      },
      {
        label: 'Budgets',
        translateLabel: 'Budgets',
        id: MENU_IDS.APP.ACQUISITION.BUDGET,
        icon: 'fa fa-money',
        routerLink: ['/', 'records', 'budgets'],
        queryParams: {
          q: '',
          page: '1',
          size: '10',
          simple: '1',
        },
        access: {
          permissions: [PERMISSIONS.BUDG_ACCESS]
        }
      },
      {
        label: 'Accounts',
        translateLabel: 'Accounts',
        id: MENU_IDS.APP.ACQUISITION.ACCOUNT,
        icon: 'fa fa-folder-open-o',
        routerLink: ['/', 'acquisition', 'accounts'],
        access: {
          permissions: [PERMISSIONS.ACAC_ACCESS]
        }
      },
      {
        label: 'Late issues',
        translateLabel: 'Late issues',
        id: MENU_IDS.APP.ACQUISITION.LATE_ISSUE,
        icon: 'fa fa-envelope-open-o',
        routerLink: ['/', 'records', 'issues'],
        queryParams: {
          q: '',
          page: '1',
          size: '10',
          library: '$currentLibrary',
          simple: '1',
        },
        access: {
          permissions: [PERMISSIONS.ISSUE_MANAGEMENT]
        }
      },
    ]
  },
  /** REPORT & MONITORING MENU */
  {
    label: 'Reports & monitoring',
    translateLabel: 'Reports & monitoring',
    id: MENU_IDS.APP.REPORT_MONITORING.MENU,
    icon: 'fa fa-bar-chart',
    items: [
      {
        label: 'Inventory list',
        translateLabel: 'Inventory list',
        id: MENU_IDS.APP.REPORT_MONITORING.INVENTORY,
        icon: 'fa fa-list',
        routerLink: ['/', 'records', 'items'],
        queryParams: {
          q: '',
          page: '1',
          size: '10',
          simple: '1',
        },
        shortcut: 'i',
        access: {
          permissions: [PERMISSIONS.ITEM_ACCESS]
        }
      },
      {
        label: 'Fees',
        translateLabel: 'Fees',
        id: MENU_IDS.APP.REPORT_MONITORING.FEE,
        icon: 'fa fa-money',
        routerLink: ['/', 'records', 'patron_transaction_events'],
        queryParams: {
          q: '',
          page: '1',
          size: '10',
          owning_library: '$currentLibrary',
          transaction_date: '$currentDayRange',
          simple: '1'
        },
        access: {
          permissions: [PERMISSIONS.PTTR_ACCESS]
        }
      },
      {
        label: 'Report configuration',
        translateLabel: 'Report configuration',
        id: MENU_IDS.APP.REPORT_MONITORING.STAT_CONFIG,
        icon: 'fa fa-cog',
        routerLink: ['/', 'records', 'stats_cfg'],
        queryParams: {
          q: '',
          page: '1',
          size: '10',
          library: "$currentLibrary",
          active: "true",
          simple: '1'
        },
        access: {
          permissions: [PERMISSIONS.STAT_CFG_ACCESS],
        },
      },
    ]
  },
  /** ADMIN MENU */
  {
    label: 'Admin',
    translateLabel: 'Admin',
    id: MENU_IDS.APP.ADMIN.MENU,
    icon: 'fa fa-cogs',
    items: [
      {
        label: 'Circulation policies',
        translateLabel: 'Circulation policies',
        id: MENU_IDS.APP.ADMIN.CIRCULATION_POLICY,
        icon: 'fa fa-exchange',
        routerLink: ['/', 'records', 'circ_policies'],
        queryParams: {
          q: '',
          page: '1',
          size: '10',
          sort: 'name',
          simple: '1',
        },
        access: {
          permissions: [PERMISSIONS.CIPO_ACCESS]
        }
      },
      {
        label: 'Item types',
        translateLabel: 'Item types',
        id: MENU_IDS.APP.ADMIN.ITEM_TYPE,
        icon: 'fa fa-file-o',
        routerLink: ['/', 'records', 'item_types'],
        queryParams: {
          q: '',
          page: '1',
          size: '10',
          sort: 'name',
          simple: '1',
        },
        access: {
          permissions: [PERMISSIONS.ITTY_ACCESS]
        }
      },
      {
        label: 'Patron types',
        translateLabel: 'Patron types',
        id:MENU_IDS.APP.ADMIN.PATRON_TYPE,
        icon: 'fa fa-users',
        routerLink: ['/', 'records', 'patron_types'],
        queryParams: {
          q: '',
          page: '1',
          size: '10',
          sort: 'name',
          simple: '1',
        },
        access: {
          permissions: [PERMISSIONS.PTTY_ACCESS]
        }
      },
      {
        label: 'My organisation',
        translateLabel: 'My organisation',
        id: MENU_IDS.APP.ADMIN.MY_ORGANISATION,
        icon: 'fa fa-university',
        routerLink: ['/', 'records', 'organisations', 'detail', '$currentOrganisation'],
        access: {
          permissions: [PERMISSIONS.ORG_ACCESS]
        }
      },
      {
        label: 'My library',
        translateLabel: 'My library',
        id: MENU_IDS.APP.ADMIN.MY_LIBRARY,
        icon: 'fa fa-university',
        routerLink: ['/', 'records', 'libraries', 'detail', '$currentLibrary'],
        access: {
          permissions: [PERMISSIONS.LIB_ACCESS]
        }
      },
      {
        label: 'Libraries',
        translateLabel: 'Libraries',
        id: MENU_IDS.APP.ADMIN.LIBRARY,
        icon: 'fa fa-users',
        routerLink: ['/', 'records', 'libraries'],
        queryParams: {
          q: '',
          page: '1',
          size: '10',
          sort: 'name',
          simple: '1',
        },
        access: {
          permissions: [PERMISSIONS.LIB_ACCESS]
        }
      },
      {
        label: 'Templates',
        translateLabel: 'Templates',
        id: MENU_IDS.APP.ADMIN.TEMPLATE,
        icon: 'fa fa-file-code-o',
        routerLink: ['/', 'records', 'templates'],
        queryParams: {
          q: '',
          page: '1',
          size: '10',
          sort: 'name',
          simple: '1',
        },
        access: {
          permissions: [PERMISSIONS.TMPL_ACCESS]
        }
      },
      {
        label: 'Permissions matrix',
        translateLabel: 'Permissions matrix',
        id: MENU_IDS.APP.ADMIN.PERMISSION,
        icon: 'fa fa-check-square-o',
        routerLink: ['/', 'permissions', 'matrix'],
        access: {
          permissions: [PERMISSIONS.PERM_MANAGEMENT]
        }
      },
    ]
  }
]
