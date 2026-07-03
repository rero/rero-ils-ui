// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
import { PERMISSIONS, PERMISSION_OPERATOR } from "@rero/shared";
import { MenuItem } from "primeng/api";
import { MENU_IDS } from "./menu-ids";

export const MENU_APP: MenuItem[] = [
  /** USER MENU */
  {
    name: 'User services',
    translateLabel: 'User services',
    id: MENU_IDS.APP.USER.MENU,
    icon: 'fa-solid fa-users',
    items: [
      {
        name: 'Checkout/checkin',
        translateLabel: 'Checkout/checkin',
        id: MENU_IDS.APP.USER.CIRCULATION,
        icon: 'fa-solid fa-right-left',
        routerLink: ['/', 'circulation'],
        shortcut: 'c',
        access: {
          permissions: [PERMISSIONS.CIRC_ADMIN]
        }
      },
      {
        label: 'Requests',
        translateLabel: 'Requests',
        id: MENU_IDS.APP.USER.REQUEST,
        icon: 'fa-solid fa-basket-shopping',
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
        icon: 'fa-solid fa-truck-fast',
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
        icon: 'fa-solid fa-users-viewfinder',
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
        icon: 'fa-solid fa-graduation-cap',
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
        icon: 'fa-solid fa-list-check',
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
    icon: 'fa-solid fa-book',
    items: [
      {
        label: 'Documents',
        translateLabel: 'Documents',
        id: MENU_IDS.APP.CATALOG.DOCUMENT,
        icon: 'fa-solid fa-file-lines',
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
        icon: 'fa-solid fa-file-circle-plus',
        routerLink: ['/', 'records', 'documents', 'new'],
        access: {
          permissions: [PERMISSIONS.DOC_CREATE]
        }
      },
      {
        label: 'Import from the web',
        translateLabel: 'Import from the web',
        id: MENU_IDS.APP.CATALOG.IMPORT,
        icon: 'fa-solid fa-cloud-arrow-down',
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
        icon: 'fa-solid fa-circle-nodes',
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
    icon: 'fa-solid fa-cart-arrow-down',
    items: [
      {
        label: 'Vendors',
        translateLabel: 'Vendors',
        id: MENU_IDS.APP.ACQUISITION.VENDOR,
        icon: 'fa-solid fa-shop',
        routerLink: ['/', 'acquisition', 'records', 'vendors'],
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
        icon: 'fa-solid fa-cart-shopping',
        routerLink: ['/', 'acquisition', 'records', 'acq_orders'],
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
        icon: 'fa-solid fa-money-bills',
        routerLink: ['/', 'acquisition', 'records', 'budgets'],
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
        icon: 'fa-solid fa-wallet',
        routerLink: ['/', 'acquisition', 'accounts'],
        access: {
          permissions: [PERMISSIONS.ACAC_ACCESS]
        }
      },
      {
        label: 'Late issues',
        translateLabel: 'Late issues',
        id: MENU_IDS.APP.ACQUISITION.LATE_ISSUE,
        icon: 'fa-solid fa-calendar-xmark',
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
    icon: 'fa-solid fa-chart-bar',
    items: [
      {
        label: 'Inventory list',
        translateLabel: 'Inventory list',
        id: MENU_IDS.APP.REPORT_MONITORING.INVENTORY,
        icon: 'fa-solid fa-list',
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
        icon: 'fa-solid fa-money-bill-wave',
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
        icon: 'fa-solid fa-chart-pie',
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
    icon: 'fa-solid fa-gears',
    items: [
      {
        label: 'Circulation policies',
        translateLabel: 'Circulation policies',
        id: MENU_IDS.APP.ADMIN.CIRCULATION_POLICY,
        icon: 'fa-solid fa-scale-balanced',
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
        icon: 'fa-solid fa-book-bookmark',
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
        icon: 'fa-solid fa-user-tag',
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
        icon: 'fa-solid fa-sitemap',
        routerLink: ['/', 'records', 'organisations', 'detail', '$currentOrganisation'],
        access: {
          permissions: [PERMISSIONS.ORG_ACCESS]
        }
      },
      {
        label: 'My library',
        translateLabel: 'My library',
        id: MENU_IDS.APP.ADMIN.MY_LIBRARY,
        icon: 'fa-solid fa-building-columns',
        routerLink: ['/', 'records', 'libraries', 'detail', '$currentLibrary'],
        access: {
          permissions: [PERMISSIONS.LIB_ACCESS]
        }
      },
      {
        label: 'Libraries',
        translateLabel: 'Libraries',
        id: MENU_IDS.APP.ADMIN.LIBRARY,
        icon: 'fa-solid fa-city',
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
        icon: 'fa-solid fa-paste',
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
        icon: 'fa-solid fa-table-cells',
        routerLink: ['/', 'permissions', 'matrix'],
        access: {
          permissions: [PERMISSIONS.PERM_MANAGEMENT]
        }
      },
      {
        name: 'Migrations',
        translateLabel: 'Migrations',
        id: MENU_IDS.APP.ADMIN.MIGRATION,
        icon: 'fa-solid fa-database',
        routerLink: ['/', 'migrations', 'records', 'migrations'],
        access: {
          permissions: [PERMISSIONS.MIG_ACCESS]
        }
      },
    ]
  }
]
