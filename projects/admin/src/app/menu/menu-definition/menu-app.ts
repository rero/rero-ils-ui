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
import { IMenuParent } from "./menu-interface";

export const MENU_APP: IMenuParent[] = [
  /** USER MENU */
  {
    name: 'User services',
    attributes: { id: 'user-services-menu' },
    extras: { iconClass: 'fa fa-users' },
    children: [
      {
        name: 'Checkout/checkin',
        router_link: ['/', 'circulation'],
        attributes: { id: 'circulation-menu' },
        extras: { iconClass: 'fa fa-exchange' },
        access: {
          permissions: [PERMISSIONS.CIRC_ADMIN]
        }
      },
      {
        name: 'Requests',
        router_link: ['/', 'circulation', 'requests'],
        attributes: { id: 'requests-menu' },
        extras: { iconClass: 'fa fa-shopping-basket' },
        access: {
          permissions: [PERMISSIONS.CIRC_ADMIN]
        }
      },
      {
        name: 'ILL requests',
        router_link: ['/', 'records', 'ill_requests'],
        query_params: {
          q: '',
          page: '1',
          size: '10',
          simple: '1',
          library: '$currentLibrary'
        },
        attributes: { id: 'ill-requests-menu' },
        extras: { iconClass: 'fa fa-truck' },
        access: {
          permissions: [PERMISSIONS.ILL_ACCESS]
        }
      },
      {
        name: 'Users',
        router_link: ['/', 'records', 'patrons'],
        query_params: {
          q: '',
          page: '1',
          size: '10',
          simple: '1'
        },
        attributes: { id: 'users-menu' },
        extras: { iconClass: 'fa fa-users' },
        access: {
          permissions: [PERMISSIONS.PTRN_ACCESS]
        }
      },
      {
        name: 'Exhibition/course',
        router_link: ['/', 'records', 'collections'],
        query_params: {
          q: '',
          page: '1',
          size: '10',
          sort: 'title',
          simple: '1',
          library: '$currentLibrary'
        },
        attributes: { id: 'collections-menu' },
        extras: { iconClass: 'fa fa-graduation-cap' },
        access: {
          permissions: [PERMISSIONS.COLL_ACCESS]
        }
      },
      {
        name: 'Current loans',
        router_link: ['/', 'records', 'loans'],
        query_params: {
          q: '',
          page: '1',
          size: '10',
          simple: '1',
          owner_library: '$currentLibrary'
        },
        attributes: { id: 'current-loans-menu' },
        extras: { iconClass: 'fa fa-list-ul' },
        access: {
          permissions: [PERMISSIONS.CIRC_ADMIN]
        }
      }
    ]
  },
  /** CATALOG MENU */
  {
    name: 'Catalog',
    attributes: { id: 'catalog-menu' },
    extras: { iconClass: 'fa fa-book' },
    children: [
      {
        name: 'Documents',
        router_link: ['/', 'records', 'documents'],
        query_params: {
          q: '',
          page: '1',
          size: '10',
          simple: '1',
          organisation: '$currentOrganisation'
        },
        attributes: { id: 'documents-menu' },
        extras: { iconClass: 'fa fa-file-o' },
        access: {
          permissions: [
            PERMISSIONS.DOC_ACCESS,
            PERMISSIONS.DOC_SEARCH
          ],
          operator: PERMISSION_OPERATOR.AND
        }
      },
      {
        name: 'Create a bibliographic record',
        router_link: ['/', 'records', 'documents', 'new'],
        attributes: { id: 'create-bibliographic-record-menu' },
        extras: { iconClass: 'fa fa-plus-square' },
        access: {
          permissions: [PERMISSIONS.DOC_CREATE]
        }
      },
      {
        name: 'Import from the web',
        router_link: ['/', 'records', 'import_bnf'],
        query_params: {
          q: '',
          page: '1',
          size: '10'
        },
        attributes: { id: 'import-menu' },
        extras: { iconClass: 'fa fa-cloud-download' },
        access: {
          permissions: [PERMISSIONS.DOC_CREATE]
        }
      },
      {
        name: 'Entities',
        router_link: ['/', 'records', 'entities'],
        query_params: {
          q: '',
          page: '1',
          size: '10'
        },
        attributes: { id: 'entities-menu' },
        extras: { iconClass: 'fa fa-cubes' }
      }
    ]
  },
  /** ACQUISITION MENU */
  {
    name: 'Acquisitions',
    attributes: { id: 'acquisitions-menu' },
    extras: { iconClass: 'fa fa-university' },
    children: [
      {
        name: 'Vendors',
        router_link: ['/', 'records', 'vendors'],
        query_params: {
          q: '',
          page: '1',
          size: '10',
          sort: 'name_asc',
          simple: '1'
        },
        attributes: { id: 'vendors-menu' },
        extras: { iconClass: 'fa fa-briefcase' },
        access: {
          permissions: [PERMISSIONS.VNDR_ACCESS]
        }
      },
      {
        name: 'Orders',
        router_link: ['/', 'records', 'acq_orders'],
        query_params: {
          q: '',
          page: '1',
          size: '10',
          library: '$currentLibrary',
          budget: '$currentBudget',
          simple: '1',
        },
        attributes: { id: 'orders-menu' },
        extras: { iconClass: 'fa fa-shopping-cart' },
        access: {
          permissions: [PERMISSIONS.ACOR_ACCESS]
        }
      },
      {
        name: 'Budgets',
        router_link: ['/', 'records', 'budgets'],
        query_params: {
          q: '',
          page: '1',
          size: '10',
          simple: '1',
        },
        attributes: { id: 'budgets-menu' },
        extras: { iconClass: 'fa fa-money' },
        access: {
          permissions: [PERMISSIONS.BUDG_ACCESS]
        }
      },
      {
        name: 'Accounts',
        router_link: ['/', 'acquisition', 'accounts'],
        attributes: { id: 'accounts-menu' },
        extras: { iconClass: 'fa fa-folder-open-o' },
        access: {
          permissions: [PERMISSIONS.ACAC_ACCESS]
        }
      },
      {
        name: 'Late issues',
        router_link: ['/', 'records', 'issues'],
        query_params: {
          q: '',
          page: '1',
          size: '10',
          library: '$currentLibrary',
          simple: '1',
        },
        attributes: { id: 'late-issues-menu' },
        extras: { iconClass: 'fa fa-envelope-open-o' },
        access: {
          permissions: [PERMISSIONS.ISSUE_MANAGEMENT]
        }
      },
    ]
  },
  /** REPORT & MONITORING MENU */
  {
    name: 'Reports & monitoring',
    attributes: { id: 'report-monitoring-menu' },
    extras: { iconClass: 'fa fa-bar-chart' },
    children: [
      {
        name: 'Inventory list',
        router_link: ['/', 'records', 'items'],
        query_params: {
          q: '',
          page: '1',
          size: '10',
          simple: '1',
        },
        attributes: { id: 'inventory-list-menu' },
        extras: { iconClass: 'fa fa-list' },
        access: {
          permissions: [PERMISSIONS.ITEM_ACCESS]
        }
      },
      {
        name: 'Fees',
        router_link: ['/', 'records', 'patron_transaction_events'],
        query_params: {
          q: '',
          page: '1',
          size: '10',
          owning_library: '$currentLibrary',
          transaction_date: '$currentDayRange',
          simple: '1'
        },
        attributes: { id: 'fees-list-menu' },
        extras: { iconClass: 'fa fa-money' },
        access: {
          permissions: [PERMISSIONS.PTTR_ACCESS]
        }
      },
      {
        name: "Report configuration",
        router_link: ["/", "records", "stats_cfg"],
        attributes: { id: "stats-cfg-menu" },
        extras: { iconClass: "fa fa-cog" },
        query_params: {
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
      }
    ]
  },
  /** ADMIN MENU */
  {
    name: 'Admin',
    attributes: { id: 'admin-and-monitoring-menu' },
    extras: { iconClass: 'fa fa-cogs' },
    children: [
      {
        name: 'Circulation policies',
        router_link: ['/', 'records', 'circ_policies'],
        query_params: {
          q: '',
          page: '1',
          size: '10',
          sort: 'name',
          simple: '1',
        },
        attributes: { id: 'circulation-policies-menu' },
        extras: { iconClass: 'fa fa-exchange' },
        access: {
          permissions: [PERMISSIONS.CIPO_ACCESS]
        }
      },
      {
        name: 'Item types',
        router_link: ['/', 'records', 'item_types'],
        query_params: {
          q: '',
          page: '1',
          size: '10',
          sort: 'name',
          simple: '1',
        },
        attributes: { id: 'item-types-menu' },
        extras: { iconClass: 'fa fa-file-o' },
        access: {
          permissions: [PERMISSIONS.ITTY_ACCESS]
        }
      },
      {
        name: 'Patron types',
        router_link: ['/', 'records', 'patron_types'],
        query_params: {
          q: '',
          page: '1',
          size: '10',
          sort: 'name',
          simple: '1',
        },
        attributes: { id: 'patron-types-menu' },
        extras: { iconClass: 'fa fa-users' },
        access: {
          permissions: [PERMISSIONS.PTTY_ACCESS]
        }
      },
      {
        name: 'My organisation',
        router_link: ['/', 'records', 'organisations', 'detail', '$currentOrganisation'],
        attributes: { id: 'my-organisation-menu' },
        extras: { iconClass: 'fa fa-university' },
        access: {
          permissions: [PERMISSIONS.ORG_ACCESS]
        }
      },
      {
        name: 'My library',
        router_link: ['/', 'records', 'libraries', 'detail', '$currentLibrary'],
        attributes: { id: 'my-library-menu' },
        extras: { iconClass: 'fa fa-university' },
        access: {
          permissions: [PERMISSIONS.LIB_ACCESS]
        }
      },
      {
        name: 'Libraries',
        router_link: ['/', 'records', 'libraries'],
        query_params: {
          q: '',
          page: '1',
          size: '10',
          sort: 'name',
          simple: '1',
        },
        attributes: { id: 'libraries-menu' },
        extras: { iconClass: 'fa fa-users' },
        access: {
          permissions: [PERMISSIONS.LIB_ACCESS]
        }
      },
      {
        name: 'Templates',
        router_link: ['/', 'records', 'templates'],
        query_params: {
          q: '',
          page: '1',
          size: '10',
          sort: 'name',
          simple: '1',
        },
        attributes: { id: 'templates-menu' },
        extras: { iconClass: 'fa fa-file-code-o' },
        access: {
          permissions: [PERMISSIONS.TMPL_ACCESS]
        }
      },
      {
        name: 'Permissions matrix',
        router_link: ['/', 'permissions', 'matrix'],
        attributes: { id: 'permissions-menu' },
        extras: { iconClass: 'fa fa-check-square-o' },
        access: {
          permissions: [PERMISSIONS.PERM_MANAGEMENT]
        }
      },
    ]
  }
]
