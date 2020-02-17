/*
 * RERO ILS UI
 * Copyright (C) 2019 RERO
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

import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '../service/user.service';
import { LocalStorageService } from '@rero/ng-core';

@Component({
  selector: 'admin-frontpage',
  templateUrl: './frontpage.component.html',
  styles: []
})
export class FrontpageComponent implements OnInit {
  /** Lists of entries */
  userServices = { title: {}, entries: [] };
  catalog = { title: {}, entries: [] };
  acquisitions = { title: {}, entries: [] };
  adminMonitoring = { title: {}, entries: [] };

  /** Constructor
   * @param _translateService - TranslateService
   * @param _userService - User Service
   * @param _localStorageService - LocalStorageService
   */
  constructor(
    private _translateService: TranslateService,
    private _userService: UserService,
    private _localStorageService: LocalStorageService
  ) { }

    /** On init hook */
  ngOnInit() {
    this.initBoard();
    this._localStorageService.onSet$.subscribe(() => {
      const link = this.adminMonitoring.entries.find(
        (element: any) => element.routerLink.indexOf('/libraries/detail') > -1
      );
      link.routerLink = this.myLibraryRouterLink();
    });
  }

  /** Router link for my library */
  private myLibraryRouterLink() {
    return `/records/libraries/detail/${this._userService.getCurrentUser().currentLibrary}`;
  }

  /** Populates the list of entries */
  initBoard() {
    this.userServices = {
      title: {
        name: this._translateService.instant('User services'),
        iconCssClass: 'fa fa-users'
      },
      entries: [
        {
          name: this._translateService.instant('Circulation'),
          routerLink: '/circulation',
          iconCssClass: 'fa fa-exchange'
        }, {
          name: this._translateService.instant('Requests'),
          routerLink: '/circulation/requests',
          iconCssClass: 'fa fa-truck'
        }, {
          name: this._translateService.instant('Patrons'),
          routerLink: '/records/patrons',
          iconCssClass: 'fa fa-users'
        }
      ]};

    this.catalog = {
      title: {
        name: this._translateService.instant('Catalog'),
          iconCssClass: 'fa fa-file-o'
      },
      entries: [
        {
          name: this._translateService.instant('Documents'),
            routerLink: '/records/documents',
            iconCssClass: 'fa fa-file-o'
          }, {
            name: this._translateService.instant('Create a bibliographic record'),
            routerLink: '/records/documents/new',
            iconCssClass: 'fa fa-file-o'
          }, {
            name: this._translateService.instant('Persons'),
            routerLink: '/records/persons',
            iconCssClass: 'fa fa-user'
        }
      ]};

    this.acquisitions = {
      title: {
        name: this._translateService.instant('Acquisitions'),
        iconCssClass: 'fa fa-university'
      },
      entries: [
        {
          name: this._translateService.instant('Vendors'),
          routerLink: '/records/vendors',
          iconCssClass: 'fa fa-briefcase'
        }, {
          name: this._translateService.instant('Orders'),
          routerLink: '/records/acq_orders',
          iconCssClass: 'fa fa-shopping-cart'
        }, {
          name: this._translateService.instant('Budgets'),
          routerLink: '/records/budgets',
          iconCssClass: 'fa fa-money'
        }
      ]};

    this.adminMonitoring = {
      title: {
        name: this._translateService.instant('Admin & Monitoring'),
        iconCssClass: 'fa fa-cogs'
      },
      entries: [
        {
          name: this._translateService.instant('Circulation policies'),
          routerLink: '/records/circ_policies',
          iconCssClass: 'fa fa-exchange'
        }, {
          name: this._translateService.instant('Item types'),
          routerLink: '/records/item_types',
          iconCssClass: 'fa fa-file-o'
        }, {
          name: this._translateService.instant('Patron types'),
          routerLink: '/records/patron_types',
          iconCssClass: 'fa fa-users'
        }, {
          name: this._translateService.instant('My organisation'),
          routerLink: `/records/organisations/detail/${this._userService.getCurrentUser().library.organisation.pid}`,
          iconCssClass: 'fa fa-university'
        }, {
          name: this._translateService.instant('My library'),
          routerLink: this.myLibraryRouterLink(),
          iconCssClass: 'fa fa-university'
        }, {
          name: this._translateService.instant('Libraries'),
          routerLink: '/records/libraries',
          iconCssClass: 'fa fa-university'
        }
      ]};
  }
}
