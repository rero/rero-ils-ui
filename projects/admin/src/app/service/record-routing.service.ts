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
import { Injectable } from '@angular/core';
import { Router, UrlSegment, ActivatedRoute } from '@angular/router';
import { of, Observable, Subscriber } from 'rxjs';

import { TranslateService } from '@ngx-translate/core';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import {
  RecordSearchComponent,
  DetailComponent,
  EditorComponent,
  ActionStatus,
  ApiService
} from '@rero/ng-core';
import { CirculationPolicyComponent } from '../record/custom-editor/circulation-settings/circulation-policy/circulation-policy.component';
import { CircPoliciesBriefViewComponent } from '../record/brief-view/circ-policies-brief-view.component';
import { DocumentsBriefViewComponent } from '../record/brief-view/documents-brief-view/documents-brief-view.component';
import { DocumentDetailViewComponent } from '../record/detail-view/document-detail-view/document-detail-view.component';
import { LibraryComponent } from '../record/custom-editor/libraries/library.component';
import { LibrariesBriefViewComponent } from '../record/brief-view/libraries-brief-view/libraries-brief-view.component';
import { PatronsBriefViewComponent } from '../record/brief-view/patrons-brief-view.component';
import { PersonsBriefViewComponent } from '../record/brief-view/persons-brief-view.component';
import { PersonDetailViewComponent } from '../record/detail-view/person-detail-view/person-detail-view.component';
import { ItemTypesBriefViewComponent } from '../record/brief-view/item-types-brief-view.component';
import { ItemTypeDetailViewComponent } from '../record/detail-view/item-type-detail-view.component';
import { PatronTypesBriefViewComponent } from '../record/brief-view/patron-types-brief-view.component';
import { PatronTypesDetailViewComponent } from '../record/detail-view/patron-types-detail-view.component';
import { LibraryDetailViewComponent } from '../record/detail-view/library-detail-view/library-detail-view.component';
import { RecordPermissionMessageService } from './record-permission-message.service';
import { CircPolicyDetailViewComponent } from '../record/detail-view/circ-policy-detail-view/circ-policy-detail-view.component';
import { LocationDetailViewComponent } from '../record/detail-view/location-detail-view/location-detail-view.component';
import { ItemDetailViewComponent } from '../record/detail-view/item-detail-view/item-detail-view.component';
import { UserService } from './user.service';
import { PatronDetailViewComponent } from '../record/detail-view/patron-detail-view/patron-detail-view.component';
import { DocumentEditorComponent } from '../record/custom-editor/document-editor/document-editor.component';

@Injectable({
  providedIn: 'root'
})
export class RecordRoutingService {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private translateService: TranslateService,
    private userService: UserService,
    private apiService: ApiService,
    private recordPermissionService: RecordPermissionMessageService
  ) {}

  initRoute() {
    this.router.config.push(
      {
        matcher: url => this.routeMatcher(url, 'documents'),
        // loadChildren: () => import('@rero/ng-core').then(m => m.RecordModule),
        children: [
          { path: '', component: RecordSearchComponent },
          { path: 'detail/:pid', component: DetailComponent },
          { path: 'edit/:pid', component: DocumentEditorComponent },
          { path: 'new', component: DocumentEditorComponent }
        ],
        data: {
          linkPrefix: 'records',
          showSearchInput: false,
          types: [
            {
              key: _('documents'),
              label: _('Documents'),
              editorLongMode: true,
              component: DocumentsBriefViewComponent,
              detailComponent: DocumentDetailViewComponent,
              canUpdate: (record: any) => this.canUpdate(record),
              canDelete: (record: any) => this.canDelete(record),
              preprocessRecordEditor: (record: any) =>
                this.preprocessDocument(record),
              aggregations: (aggregations: any) => this.filter(aggregations),
              aggregationsOrder: [
                _('document_type'),
                _('author__fr'),
                _('author__en'),
                _('author__de'),
                _('author__it'),
                _('library'),
                _('organisation'),
                _('language'),
                _('subject'),
                _('status')
              ],
              aggregationsExpand: ['document_type'],
              aggregationsBucketSize: 10,
              itemHeaders: {
                Accept: 'application/rero+json, application/json'
              }
            }
          ]
        }
      },
      {
        matcher: url => this.routeMatcher(url, 'libraries'),
        children: [
          { path: '', component: RecordSearchComponent },
          { path: 'detail/:pid', component: DetailComponent },
          { path: 'edit/:pid', component: LibraryComponent },
          { path: 'new', component: LibraryComponent }
        ],
        data: {
          linkPrefix: 'records',
          types: [
            {
              key: _('libraries'),
              label: _('Libraries'),
              component: LibrariesBriefViewComponent,
              detailComponent: LibraryDetailViewComponent,
              canAdd: () => this.canAddLibrary(),
              canUpdate: (record: any) => this.canUpdate(record),
              canDelete: (record: any) => this.canDelete(record),
              preprocessRecordEditor: (data: any) =>
                this.addLibrarianOrganisation(data)
            }
          ]
        }
      },
      {
        matcher: url => this.routeMatcher(url, 'patrons'),
        children: [
          { path: '', component: RecordSearchComponent },
          { path: 'detail/:pid', component: DetailComponent },
          { path: 'edit/:pid', component: EditorComponent },
          { path: 'new', component: EditorComponent }
        ],
        data: {
          linkPrefix: 'records',
          types: [
            {
              key: _('patrons'),
              label: _('Patrons'),
              component: PatronsBriefViewComponent,
              detailComponent: PatronDetailViewComponent,
              canUpdate: (record: any) => this.canUpdate(record),
              canDelete: (record: any) => this.canDelete(record),
              aggregationsExpand: ['roles']
            }
          ]
        }
      },
      {
        matcher: url => this.routeMatcher(url, 'persons'),
        children: [
          { path: '', component: RecordSearchComponent },
          { path: 'detail/:pid', component: DetailComponent }
        ],
        data: {
          linkPrefix: 'records',
          adminMode: false,
          types: [
            {
              key: _('persons'),
              label: _('Persons'),
              component: PersonsBriefViewComponent,
              detailComponent: PersonDetailViewComponent,
              canUpdate: (record: any) => this.canUpdate(record),
              canDelete: (record: any) => this.canDelete(record),
              aggregationsExpand: ['sources']
            }
          ]
        }
      },
      {
        matcher: url => this.routeMatcher(url, 'item_types'),
        children: [
          { path: '', component: RecordSearchComponent },
          { path: 'detail/:pid', component: DetailComponent },
          { path: 'edit/:pid', component: EditorComponent },
          { path: 'new', component: EditorComponent }
        ],
        data: {
          linkPrefix: 'records',
          types: [
            {
              key: _('item_types'),
              label: _('Item types'),
              component: ItemTypesBriefViewComponent,
              detailComponent: ItemTypeDetailViewComponent,
              canAdd: () => this.canAddItemType(),
              canUpdate: (record: any) => this.canUpdate(record),
              canDelete: (record: any) => this.canDelete(record),
              preprocessRecordEditor: (data: any) =>
                this.addLibrarianOrganisation(data)
            }
          ]
        }
      },
      {
        matcher: url => this.routeMatcher(url, 'items'),
        children: [
          { path: 'detail/:pid', component: DetailComponent },
          { path: 'edit/:pid', component: EditorComponent },
          { path: 'new', component: EditorComponent }
        ],
        data: {
          linkPrefix: 'records',
          types: [
            {
              key: _('items'),
              label: _('Items'),
              detailComponent: ItemDetailViewComponent,
              canRead: (record: any) => this.canReadItem(record),
              canUpdate: (record: any) => this.canUpdate(record),
              canDelete: (record: any) => this.canDelete(record),
              preprocessRecordEditor: (record: any) =>
                this.preprocessItem(record)
            }
          ]
        }
      },
      {
        matcher: url => this.routeMatcher(url, 'locations'),
        children: [
          { path: 'detail/:pid', component: DetailComponent },
          { path: 'edit/:pid', component: EditorComponent },
          { path: 'new', component: EditorComponent }
        ],
        data: {
          linkPrefix: 'records',
          types: [
            {
              key: _('locations'),
              label: _('Locations'),
              detailComponent: LocationDetailViewComponent,
              canAdd: () => this.canAddLocation(),
              canUpdate: (record: any) => this.canUpdate(record),
              canDelete: (record: any) => this.canDelete(record),
              preprocessRecordEditor: (record: any) =>
                this.preprocessLocation(record)
            }
          ]
        }
      },
      {
        matcher: url => this.routeMatcher(url, 'patron_types'),
        children: [
          { path: '', component: RecordSearchComponent },
          { path: 'detail/:pid', component: DetailComponent },
          { path: 'edit/:pid', component: EditorComponent },
          { path: 'new', component: EditorComponent }
        ],
        data: {
          linkPrefix: 'records',
          types: [
            {
              key: _('patron_types'),
              label: _('Patron types'),
              component: PatronTypesBriefViewComponent,
              detailComponent: PatronTypesDetailViewComponent,
              canAdd: () => this.canAddPatronType(),
              canUpdate: (record: any) => this.canUpdate(record),
              canDelete: (record: any) => this.canDelete(record),
              preprocessRecordEditor: (data: any) =>
                this.addLibrarianOrganisation(data)
            }
          ]
        }
      },
      {
        matcher: url => this.routeMatcher(url, 'circ_policies'),
        children: [
          { path: '', component: RecordSearchComponent },
          { path: 'detail/:pid', component: DetailComponent },
          { path: 'edit/:pid', component: CirculationPolicyComponent },
          { path: 'new', component: CirculationPolicyComponent }
        ],
        data: {
          linkPrefix: 'records',
          types: [
            {
              key: _('circ_policies'),
              label: _('Circulation policies'),
              component: CircPoliciesBriefViewComponent,
              detailComponent: CircPolicyDetailViewComponent,
              canAdd: () => this.canAddCiculationPolicy(),
              canUpdate: (record: any) => this.canUpdate(record),
              canDelete: (record: any) => this.canDelete(record)
            }
          ]
        }
      }
    );
  }

  /**
   * Adds the $ref of the librarian organisation to the data
   * @param data - object, record data before edition
   * @returns object, the modified record data
   */
  private addLibrarianOrganisation(data: any) {
    const user = this.userService.getCurrentUser();
    const orgPid = user.library.organisation.pid;
    if (orgPid != null && data.organisation == null) {
      data.organisation = {
        $ref: this.apiService.getRefEndpoint('organisations', orgPid)
      };
    }
    return data;
  }

  /** Recursively remove a key of an object
   * @param data - object, the given object
   * @param key - string, the key to remove
   * @returns object, the object without the keys
   */
  removeKey(data, key) {
    // array?
    if (data instanceof Array) {
      data = data.map(v => this.removeKey(v, key));
    }
    // object?
    if (data instanceof Object) {
      // new object with non empty values
      for (const k of Object.keys(data)) {
        if (k === key) {
          delete(data[key]);
        } else {
          data[k] = this.removeKey(data[k], key);
        }
      }
    }
    return data;
  }

  /**
   * Removes the dynamic added fields
   * @param data - object, item data before edition
   * @returns object, the modified record data
   */
  private preprocessDocument(data: any) {
    this.removeKey(data, '_text');
    return data;
  }

  /**
   * Adds the $ref of the document to the item data and removes dynamic fields.
   * @param data - object, item data before edition
   * @returns object, the modified record data
   */
  private preprocessItem(data: any) {
    const docPid = this.route.snapshot.queryParams.document;
    if (data.pid == null && docPid != null && data.document == null) {
      data.document = {
        $ref: this.apiService.getRefEndpoint('documents', docPid)
      };
    }
    // remove dynamic field
    if (data.hasOwnProperty('available')) {
      delete data.available;
    }
    return data;
  }

  /**
   * Adds the $ref of the library to the location data
   * @param data - object, item data before edition
   * @returns object, the modified record data
   */
  private preprocessLocation(locationData: any) {
    const libPid = this.route.snapshot.queryParams.library;
    if (
      locationData.pid == null &&
      libPid != null &&
      locationData.library == null
    ) {
      locationData.library = {
        $ref: this.apiService.getRefEndpoint('libraries', libPid)
      };
    }
    return locationData;
  }

  private matchedUrl(url: UrlSegment[]) {
    const segments = [
      new UrlSegment(url[0].path, {}),
      new UrlSegment(url[1].path, {})
    ];
    return {
      consumed: segments,
      posParams: { type: new UrlSegment(url[1].path, {}) }
    };
  }

  private routeMatcher(url: any, type: string) {
    if (url[0].path === 'records' && url[1].path === type) {
      return this.matchedUrl(url);
    }
    return null;
  }

  private filter(aggregations: object): Observable<any> {
    const obs = new Observable((observer: Subscriber<any>): void => {
      observer.next(this.aggregationFilter(aggregations));
      this.translateService.onLangChange.subscribe(() => {
        observer.next(this.aggregationFilter(aggregations));
      });
    });
    return obs;
  }

  private aggregationFilter(aggregations: object) {
    const aggs = {};
    Object.keys(aggregations).forEach(aggregation => {
      if ('organisation' !== aggregation) {
        if (aggregation.indexOf('__') > -1) {
          const splitted = aggregation.split('__');
          if (this.translateService.currentLang === splitted[1]) {
            aggs[aggregation] = aggregations[aggregation];
          }
        } else {
          aggs[aggregation] = aggregations[aggregation];
        }
      }
    });
    return aggs;
  }

  private canAddLibrary() {
    return this.canAddSystemLibrarian();
  }

  private canAddItemType() {
    return this.canAddSystemLibrarian();
  }

  private canAddPatronType() {
    return this.canAddSystemLibrarian();
  }

  private canAddCiculationPolicy() {
    return this.canAddSystemLibrarian();
  }

  private canAddLocation() {
    return this.canAddSystemLibrarian();
  }

  private canAddSystemLibrarian() {
    return of({
      can: this.userService.hasRole('system_librarian'),
      message: ''
    });
  }

  private canReadItem(record: any) {
    const organisationPid = this.userService.getCurrentUser().library
      .organisation.pid;
    if ('organisation' in record.metadata) {
      return of({
        can: organisationPid === record.metadata.organisation.pid,
        message: ''
      });
    }
    return of({ can: false, message: '' });
  }

  private canUpdate(record: any) {
    if (record.permissions && record.permissions.cannot_update) {
      return of({ can: false, message: '' });
    }
    return of({ can: true, message: '' });
  }

  private canDelete(record: any): Observable<ActionStatus> {
    const obs = new Observable((observer: Subscriber<any>): void => {
      if (
        record.permissions &&
        record.permissions.cannot_delete &&
        record.permissions.cannot_delete.permission &&
        record.permissions.cannot_delete.permission === 'permission denied'
      ) {
        observer.next({ can: false, message: '' });
      } else {
        observer.next({
          can: !this.recordPermissionService.generateMessage(record),
          message: this.recordPermissionService.generateMessage(record)
        });
        this.translateService.onLangChange.subscribe(() => {
          observer.next({
            can: !this.recordPermissionService.generateMessage(record),
            message: this.recordPermissionService.generateMessage(record)
          });
        });
      }
    });

    return obs;
  }
}
