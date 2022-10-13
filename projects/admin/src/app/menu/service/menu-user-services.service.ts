/*
 * RERO ILS UI
 * Copyright (C) 2020 RERO
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

import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MenuFactory, MenuItemInterface } from '@rero/ng-core';
import { PERMISSIONS, PermissionsService, PERMISSION_OPERATOR, User, UserService } from '@rero/shared';
import { LibrarySwitchService } from './library-switch.service';
import { MenuBase } from './menu-base';

@Injectable({
  providedIn: 'root'
})
export class MenuUserServicesService extends MenuBase {

  /** Menu */
  private _menu: MenuItemInterface = null;

  /** ILL request menu */
  private _illRequestsMenu: MenuItemInterface;

  /** Collection menu */
  private _collectionsMenu: MenuItemInterface;

  /** Documents menu */
  private _documentsMenu: MenuItemInterface;

  /** My organisation menu */
  private _myOrganisationMenu: MenuItemInterface;

  /** My library menu */
  private _myLibraryMenu: MenuItemInterface;

  /** Orders menu */
  private _ordersMenu: MenuItemInterface;

  /** Inventory menu */
  private _inventoryMenu: MenuItemInterface;

  /** Fees menu */
  private _feeMenu: MenuItemInterface;

  /** Current loans */
  private _currentLoansMenu: MenuItemInterface;

  /** late issue menu */
  private _lateIssuesMenu: MenuItemInterface;

  /**
   * User services menu
   * @return MenuItemInterface
   */
  get menu(): MenuItemInterface {
    return this._menu;
  }

  /**
   * Constructor
   * @param _librarySwitchService - LibrarySwitchService
   * @param _translateService - TranslateService
   * @param _userService - UserService
   * @param _permissionsService - PermissionsService
   */
  constructor(
    private _librarySwitchService: LibrarySwitchService,
    private _translateService: TranslateService,
    private _userService: UserService,
    private _permissionsService: PermissionsService
  ) {
    super(_translateService);
    this._initObservable();
  }

  /** Generate */
  generate(): void {
    const factory = new MenuFactory();
    const menu = factory.createItem('UI Main menu');

    this._userServicesMenu(menu);
    this._catalogMenu(menu);
    this._acquisitionMenu(menu);
    this._reportMonitoringMenu(menu);
    this._adminMenu(menu);
    this._menu = menu;
  }

  /**
   * User services menu
   * @param menu - MenuItemInterface
   */
  private _userServicesMenu(menu: MenuItemInterface): void {
    if (this._permissionsService.canAccess([
      PERMISSIONS.CIRC_ADMIN,
      PERMISSIONS.ILL_ACCESS,
      PERMISSIONS.PTRN_ACCESS,
      PERMISSIONS.COLL_ACCESS
    ])) {
      const servicesMenu = menu.addChild('User services')
      .setAttribute('id', 'user-services-menu')
      .setExtra('iconClass', 'fa fa-users');
      this._translatedName(servicesMenu, 'User services');

      if (this._permissionsService.canAccess(PERMISSIONS.CIRC_ADMIN)) {
        // ----- CHECKOUT / CHECKIN
        const checkOutInMenu = servicesMenu.addChild('Checkout/checkin')
        .setRouterLink(['/', 'circulation'])
        .setAttribute('id', 'circulation-menu')
        .setExtra('iconClass', 'fa fa-exchange');
        this._translatedName(checkOutInMenu, 'Checkout/checkin');

        // ----- REQUESTS
        const requestsMenu = servicesMenu.addChild('Requests')
        .setRouterLink(['/', 'circulation', 'requests'])
        .setAttribute('id', 'requests-menu')
        .setExtra('iconClass', 'fa fa-shopping-basket');
        this._translatedName(requestsMenu, 'Requests');
      }

      // ----- ILL REQUESTS
      if (this._permissionsService.canAccess(PERMISSIONS.ILL_ACCESS)) {
        this._illRequestsMenu = servicesMenu.addChild('ILL Requests')
        .setRouterLink(['/', 'records', 'ill_requests'])
        .setQueryParam('library', this._userService.user.currentLibrary)
        .setAttribute('id', 'ill-requests-menu')
        .setExtra('iconClass', 'fa fa-shopping-basket');
      this._translatedName(this._illRequestsMenu, 'ILL requests');
      }

      // ----- USERS
      if (this._permissionsService.canAccess(PERMISSIONS.PTRN_ACCESS)) {
        const usersMenu = servicesMenu.addChild('Users')
        .setRouterLink(['/', 'records', 'patrons'])
        .setAttribute('id', 'users-menu')
        .setExtra('iconClass', 'fa fa-users');
        this._translatedName(usersMenu, 'Users');
      }

      // ----- EXHIBITION/COURSE
      if (this._permissionsService.canAccess(PERMISSIONS.COLL_ACCESS)) {
        this._collectionsMenu = servicesMenu.addChild('Exhibition/course')
        .setRouterLink(['/', 'records', 'collections'])
        .setQueryParam('library', this._userService.user.currentLibrary)
        .setAttribute('id', 'collections-menu')
        .setExtra('iconClass', 'fa fa-graduation-cap');
        this._translatedName(this._collectionsMenu, 'Exhibition/course');
      }

      // ----- CURRENT LOANS
      if (this._permissionsService.canAccess(PERMISSIONS.CIRC_ADMIN)) {
        this._currentLoansMenu = servicesMenu.addChild('Current loans')
        .setRouterLink(['/', 'records', 'loans'])
        .setQueryParam('owner_library', this._userService.user.currentLibrary)
        .setAttribute('id', 'current-loans-menu')
        .setExtra('iconClass', 'fa fa-list-ul');
        this._translatedName(this._currentLoansMenu, 'Current loans');
      }
    }
  }

  /**
   * Catalog menu
   * @param menu - MenuItemInterface
   */
  private _catalogMenu(menu: MenuItemInterface): void {
    const catalogMenu = menu.addChild('Catalog')
    .setAttribute('id', 'catalog-menu')
    .setExtra('iconClass', 'fa fa-file-o');
    this._translatedName(catalogMenu, 'Catalog');

    // ----- DOCUMENTS
    if (this._permissionsService.canAccess([PERMISSIONS.DOC_ACCESS, PERMISSIONS.DOC_SEARCH], PERMISSION_OPERATOR.AND)) {
      this._documentsMenu = catalogMenu.addChild('Documents')
      .setRouterLink(['/', 'records', 'documents'])
      .setAttribute('id', 'documents-menu')
      .setExtra('iconClass', 'fa fa-file-o');
      this._translatedName(this._documentsMenu, 'Documents');
    }

    // ----- CREATE BIBLIOGRAPHIC RECORD
    if (this._permissionsService.canAccess(PERMISSIONS.DOC_CREATE)) {
      const createBibRecordMenu = catalogMenu.addChild(
        this._translateService.instant('Create a bibliographic record')
      )
      .setRouterLink(['/', 'records', 'documents', 'new'])
      .setAttribute('id', 'create-bibliographic-record-menu')
      .setExtra('iconClass', 'fa fa-file-o');
      this._translatedName(createBibRecordMenu, 'Create a bibliographic record');

      // ----- IMPORT FROM WEB
      const importFromWebMenu = catalogMenu.addChild('Import from the web')
      .setRouterLink(['/', 'records', 'import_bnf'])
      .setAttribute('id', 'import-menu')
      .setExtra('iconClass', 'fa fa-file-o');
      this._translatedName(importFromWebMenu, 'Import from the web');
    }

    // ----- PERSONS
    const personsMenu = catalogMenu.addChild('Persons')
    .setRouterLink(['/', 'records', 'persons'])
    .setAttribute('id', 'persons-menu')
    .setExtra('iconClass', 'fa fa-user');
    this._translatedName(personsMenu, 'Persons');

    // ----- CORPORATE BODIES
    const corporateBodiesMenu = catalogMenu.addChild('Corporate bodies')
    .setRouterLink(['/', 'records', 'corporate-bodies'])
    .setAttribute('id', 'corporate-bodies-menu')
    .setExtra('iconClass', 'fa fa-building');
    this._translatedName(corporateBodiesMenu, 'Corporate bodies');
  }

  /**
   * Acquisition menu
   * @param menu - MenuItemInterface
   */
  private _acquisitionMenu(menu: MenuItemInterface): void {
    if (this._permissionsService.canAccess([
      PERMISSIONS.VNDR_ACCESS,
      PERMISSIONS.ACOR_ACCESS,
      PERMISSIONS.BUDG_ACCESS,
      PERMISSIONS.ACAC_ACCESS,
      PERMISSIONS.ISSUE_MANAGEMENT
    ])) {
      const acquisitionMenu = menu.addChild(
        this._translateService.instant('Acquisitions')
      )
      .setAttribute('id', 'acquisitions-menu')
      .setExtra('iconClass', 'fa fa-university');
      this._translatedName(acquisitionMenu, 'Acquisitions');

      // ----- VENDORS
      if (this._permissionsService.canAccess(PERMISSIONS.VNDR_ACCESS)) {
        const vendorsMenu = acquisitionMenu.addChild('Vendors')
        .setRouterLink(['/', 'records', 'vendors'])
        .setAttribute('id', 'vendors-menu')
        .setExtra('iconClass', 'fa fa-briefcase');
        this._translatedName(vendorsMenu, 'Vendors');
      }

      // ----- ORDERS
      if (this._permissionsService.canAccess(PERMISSIONS.ACOR_ACCESS)) {
        this._ordersMenu = acquisitionMenu.addChild('Orders')
        .setRouterLink(['/', 'records', 'acq_orders'])
        .setQueryParam('library', this._userService.user.currentLibrary)
        .setQueryParam('budget', this._userService.user.currentBudget)
    .setAttribute('id', 'orders-menu')
        .setExtra('iconClass', 'fa fa-shopping-cart');
        this._translatedName(this._ordersMenu, 'Orders');
      }

      // ----- BUDGETS
      if (this._permissionsService.canAccess(PERMISSIONS.BUDG_ACCESS)) {
        const budgetsMenu = acquisitionMenu.addChild('Budgets')
        .setRouterLink(['/', 'records', 'budgets'])
        .setAttribute('id', 'budgets-menu')
        .setExtra('iconClass', 'fa fa-money');
        this._translatedName(budgetsMenu, 'Budgets');
      }

      // ----- ACCOUNTS
      if (this._permissionsService.canAccess(PERMISSIONS.ACAC_ACCESS)) {
        const accountsMenu = acquisitionMenu.addChild('Accounts')
          .setRouterLink(['/', 'acquisition', 'accounts'])
          .setAttribute('id', 'accounts-menu')
          .setExtra('iconClass', 'fa fa-folder-open-o');
        this._translatedName(accountsMenu, 'Accounts');
      }

      // ----- LATE ISSUES
      if (this._permissionsService.canAccess(PERMISSIONS.ISSUE_MANAGEMENT)) {
        this._lateIssuesMenu = acquisitionMenu.addChild('Late issues')
          .setRouterLink(['/', 'records', 'issues'])
          .setQueryParam('library', this._userService.user.currentLibrary)
          .setAttribute('id', 'late-issues-menu')
          .setExtra('iconClass', 'fa fa-envelope-open-o');
        this._translatedName(this._lateIssuesMenu, 'Late issues');
      }
    }
  }

  /**
   * Report and monitoring menu
   * @param menu - MenuItemInterface
   */
  private _reportMonitoringMenu(menu: MenuItemInterface): void {
    if (this._permissionsService.canAccess([
      PERMISSIONS.ITEM_ACCESS
    ])) {
      const reportMenu = menu.addChild('Reports & monitoring')
        .setAttribute('id', 'report-monitoring-menu')
        .setExtra('iconClass', 'fa fa-bar-chart');
      this._translatedName(reportMenu, 'Reports & monitoring');

      // ----- INVENTORY LIST
      if (this._permissionsService.canAccess(PERMISSIONS.ITEM_ACCESS)) {
        this._inventoryMenu = reportMenu.addChild('Inventory list')
          .setRouterLink(['/', 'records', 'items'])
          .setQueryParam('library', this._userService.user.currentLibrary)
          .setAttribute('id', 'inventory-list-menu')
          .setExtra('iconClass', 'fa fa-list');
        this._translatedName(this._inventoryMenu, 'Inventory list');
      }

      // ----- FEES LIST
      if (this._permissionsService.canAccess(PERMISSIONS.PTTR_ACCESS)) {
        const tstamp = Date.now();
        const millis_in_day = tstamp % 86400000;  // 86400000 millis in a day
        const current_day = tstamp - millis_in_day;

        this._feeMenu = reportMenu.addChild('Fees')
          .setRouterLink(['/', 'records', 'patron_transaction_events'])
          .setQueryParam('transaction_library', this._userService.user.currentLibrary)
          .setQueryParam('transaction_date', `${current_day}--${tstamp}`)
          .setAttribute('id', 'fees-list-menu')
          .setExtra('iconClass', 'fa fa-money');
        this._translatedName(this._feeMenu, 'Fees');
      }
    }
  }

  /**
   * Admin menu
   * @param menu - MenuItemInterface
   */
  private _adminMenu(menu: MenuItemInterface): void {
    if (this._permissionsService.canAccess([
      PERMISSIONS.CIPO_ACCESS,
      PERMISSIONS.ITTY_ACCESS,
      PERMISSIONS.PTTY_ACCESS,
      PERMISSIONS.ORG_ACCESS,
      PERMISSIONS.LIB_ACCESS,
      PERMISSIONS.TMPL_ACCESS,
      PERMISSIONS.PERM_MANAGEMENT
    ])) {
      const adminMenu = menu.addChild('Admin')
      .setAttribute('id', 'admin-and-monitoring-menu')
      .setExtra('iconClass', 'fa fa-cogs');
      this._translatedName(adminMenu, 'Admin');

      // ----- CIRCULATION POLICIES
      if (this._permissionsService.canAccess(PERMISSIONS.CIPO_ACCESS)) {
        const circulationPoliciesMenu = adminMenu.addChild('Circulation policies')
        .setRouterLink(['/', 'records', 'circ_policies'])
        .setAttribute('id', 'circulation-policies-menu')
        .setExtra('iconClass', 'fa fa-exchange');
        this._translatedName(circulationPoliciesMenu, 'Circulation policies');
      }

      // ----- ITEM TYPES
      if (this._permissionsService.canAccess(PERMISSIONS.ITTY_ACCESS)) {
        const itemTypesMenu = adminMenu.addChild('Item types')
        .setRouterLink(['/', 'records', 'item_types'])
        .setAttribute('id', 'item-types-menu')
        .setExtra('iconClass', 'fa fa-file-o');
        this._translatedName(itemTypesMenu, 'Item types');
      }

      // ----- PATRON TYPES
      if (this._permissionsService.canAccess(PERMISSIONS.PTTY_ACCESS)) {
        const patronTypesMenu = adminMenu.addChild('Patron types')
        .setRouterLink(['/', 'records', 'patron_types'])
        .setAttribute('id', 'patron-types-menu')
        .setExtra('iconClass', 'fa fa-users');
        this._translatedName(patronTypesMenu, 'Patron types');
      }

      // ----- MY ORGANISATION
      if (this._permissionsService.canAccess(PERMISSIONS.ORG_ACCESS)) {
        this._myOrganisationMenu = adminMenu.addChild('My organisation')
        .setRouterLink([
          '/', 'records', 'organisations',
          'detail', this._userService.user.currentOrganisation
        ])
        .setAttribute('id', 'my-organisation-menu')
        .setExtra('iconClass', 'fa fa-university');
        this._translatedName(this._myOrganisationMenu, 'My organisation');
      }

      // ----- MY LIBRARY
      if (this._permissionsService.canAccess(PERMISSIONS.LIB_ACCESS)) {
        this._myLibraryMenu = adminMenu.addChild('My library')
        .setRouterLink([
          '/', 'records', 'libraries',
          'detail', this._userService.user.currentLibrary
        ])
        .setAttribute('id', 'my-library-menu')
        .setExtra('iconClass', 'fa fa-university');
        this._translatedName(this._myLibraryMenu, 'My library');

        // ----- LIBRARIES
        const librariesMenu = adminMenu.addChild('Libraries')
        .setRouterLink(['/', 'records', 'libraries'])
        .setAttribute('id', 'libraries-menu')
        .setExtra('iconClass', 'fa fa-users');
        this._translatedName(librariesMenu, 'Libraries');
      }

      // ----- TEMPLATES
      if (this._permissionsService.canAccess(PERMISSIONS.TMPL_ACCESS)) {
        const templatesMenu = adminMenu.addChild('Templates')
        .setRouterLink(['/', 'records', 'templates'])
        .setAttribute('id', 'templates-menu')
        .setExtra('iconClass', 'fa fa-file-code-o');
        this._translatedName(templatesMenu, 'Templates');
      }

      // ----- PERMISSIONS MATRIX
      if (this._permissionsService.canAccess(PERMISSIONS.PERM_MANAGEMENT)) {
        const templatesMenu = adminMenu.addChild('Permissions matrix')
        .setRouterLink(['/', 'permissions', 'matrix'])
        .setAttribute('id', 'permissions-menu')
        .setExtra('iconClass', 'fa fa-check-square-o');
        this._translatedName(templatesMenu, 'Permissions matrix');
      }
    }
  }

  /** Init observable */
  private _initObservable(): void {
    // library switch observable
    this._librarySwitchService.librarySwitch$.subscribe((user: User) => {
      // USER SERVICES: COLLECTIONS, ILL REQUESTS
      if (this._illRequestsMenu) {
        this._illRequestsMenu.setQueryParam('library', user.currentLibrary);
      }
      if (this._collectionsMenu) {
        this._collectionsMenu.setQueryParam('library', user.currentLibrary);
      }
      if (this._currentLoansMenu) {
        this._currentLoansMenu.setQueryParam('owner_library', user.currentLibrary);
      }

      // ACQUISITION:
      if (this._ordersMenu) {
        this._ordersMenu.setQueryParam('library', user.currentLibrary);
        this._ordersMenu.setQueryParam('budget', user.currentBudget);
      }
      if (this._lateIssuesMenu) {
        this._lateIssuesMenu.setQueryParam('library', user.currentLibrary);
      }

      // REPORT: INVENTORY LIST
      if (this._inventoryMenu) {
        this._inventoryMenu.setQueryParam('library', user.currentLibrary);
        this._feeMenu.setQueryParam('transaction_library', user.currentLibrary);
      }

      // ADMIN: MY ORGANISATION
      if (this._myOrganisationMenu) {
        this._myOrganisationMenu.setRouterLink([
          '/', 'records', 'organisations',
          'detail', user.currentOrganisation
        ]);
      }

      // ADMIN: MY LIBRARY
      if (this._myLibraryMenu) {
        this._myLibraryMenu.setRouterLink([
          '/', 'records', 'libraries',
          'detail', user.currentLibrary
        ]);
      }
    });
  }
}
