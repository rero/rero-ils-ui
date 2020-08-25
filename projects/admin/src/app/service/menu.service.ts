import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  /**
   * Menu content
   */
  linksMenu = {
    navCssClass: 'navbar-nav',
    entries: [
      {
        name: this._translateService.instant('User services'),
        iconCssClass: 'fa fa-users',
        id: 'user-services-menu',
        entries: [{
          name: this._translateService.instant('Circulation'),
          routerLink: '/circulation',
          iconCssClass: 'fa fa-exchange',
          id: 'circulation-menu'
        }, {
          name: this._translateService.instant('Requests'),
          routerLink: '/circulation/requests',
          iconCssClass: 'fa fa-shopping-basket',
          id: 'requests-menu'
        }, {
          name: this._translateService.instant('Patrons'),
          routerLink: '/records/patrons',
          iconCssClass: 'fa fa-users',
          id: 'patrons-menu'
        }]
      }, {
        name: this._translateService.instant('Catalog'),
        iconCssClass: 'fa fa-file-o',
        id: 'catalog-menu',
        entries: [{
          name: this._translateService.instant('Documents'),
          routerLink: '/records/documents',
          queryParams: this._myDocumentsQueryParams(),
          iconCssClass: 'fa fa-file-o',
          id: 'documents-menu'
        }, {
          name: this._translateService.instant('Create a bibliographic record'),
          routerLink: '/records/documents/new',
          iconCssClass: 'fa fa-file-o',
          id: 'create-bibliographic-record-menu'
        }, {
          name: this._translateService.instant('Import from the web'),
          routerLink: '/records/import_bnf',
          iconCssClass: 'fa fa-file-o',
          id: 'import-menu'
        }, {
          name: this._translateService.instant('Persons'),
          routerLink: '/records/persons',
          iconCssClass: 'fa fa-user',
          id: 'persons-menu'
        }]
      }, {
        name: this._translateService.instant('Acquisitions'),
        iconCssClass: 'fa fa-university',
        id: 'acquisitions-menu',
        entries: [{
          name: this._translateService.instant('Vendors'),
          routerLink: '/records/vendors',
          iconCssClass: 'fa fa-briefcase',
          id: 'vendors-menu'
        }, {
          name: this._translateService.instant('Orders'),
          routerLink: '/records/acq_orders',
          iconCssClass: 'fa fa-shopping-cart',
          id: 'orders-menu'
        }, {
          name: this._translateService.instant('Budgets'),
          routerLink: '/records/budgets',
          iconCssClass: 'fa fa-money',
          id: 'budgets-menu'
        }]
      }, {
        name: this._translateService.instant('Reports & monitoring'),
        iconCssClass: 'fa fa-bar-chart',
        entries: [{
          name: this._translateService.instant('Inventory list'),
          queryParams: this._myLibraryQueryParams(),
          routerLink: '/records/items',
          iconCssClass: 'fa fa-list'
        }]
      }, {
        name: this._translateService.instant('Admin'),
        iconCssClass: 'fa fa-cogs',
        id: 'admin-and-monitoring-menu',
        entries: [{
          name: this._translateService.instant('Circulation policies'),
          routerLink: '/records/circ_policies',
          iconCssClass: 'fa fa-exchange',
          id: 'circulation-policies-menu',
          section: 'circulation-resource'
        }, {
          name: this._translateService.instant('Item types'),
          routerLink: '/records/item_types',
          iconCssClass: 'fa fa-file-o',
          id: 'item-types-menu',
          section: 'circulation-resource'
        }, {
          name: this._translateService.instant('Patron types'),
          routerLink: '/records/patron_types',
          iconCssClass: 'fa fa-users',
          id: 'patron-types-menu',
          section: 'circulation-resource'
        }, {
          name: this._translateService.instant('My organisation'),
          routerLink: this._myOrganisationRouterLink(),
          iconCssClass: 'fa fa-university',
          id: 'my-organisation-menu',
          section: 'structure-resource'
        }, {
          name: this._translateService.instant('My library'),
          routerLink: this._myLibraryRouterLink(),
          iconCssClass: 'fa fa-university',
          id: 'my-library-menu',
          section: 'structure-resource'
        }, {
          name: this._translateService.instant('Libraries'),
          routerLink: '/records/libraries',
          iconCssClass: 'fa fa-university',
          id: 'libraries-menu',
          section: 'structure-resource'
        }, {
          name: this._translateService.instant('Templates'),
          routerLink: '/records/templates',
          iconCssClass: 'fa fa-file-code-o',
          id: 'templates-menu',
          section: 'cataloging-resource'
        }]
      }
    ]
  };

  /**
   * Constructor
   *
   * @param _translateService : TranslateService
   * @param _userService : UserService
   */
  constructor(
    private _translateService: TranslateService,
    private _userService: UserService,
  ) {}

  /**
   * Router link to my library
   *
   * @return logged user library url for router link
   */
  private _myLibraryRouterLink() {
    return `/records/libraries/detail/${this._userService.getCurrentUser().currentLibrary}`;
  }

  /**
   * Router link to my organisation
   *
   * @return logged user organisation url for router link
   */
  private _myOrganisationRouterLink() {
    return `/records/organisations/detail/${this._userService.getCurrentUser().library.organisation.pid}`;
  }

  /**
   * Query params to filter documents by organisation
   *
   * @return organisation pid as a dictionary
   */
  private _myDocumentsQueryParams() {
    return {organisation: this._userService.getCurrentUser().library.organisation.pid};
  }

  /**
   * Query param to filter items list by current library
   *
   * @return library pid as a dictionary
   */
  private _myLibraryQueryParams() {
    return {library: this._userService.getCurrentUser().library.pid};
  }
}
