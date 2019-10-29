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
import { Router, UrlSegment } from '@angular/router';
import { I18nPluralPipe, NgLocaleLocalization } from '@angular/common';
import { of, Observable, Subscriber } from 'rxjs';

import { TranslateService } from '@ngx-translate/core';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { RecordSearchComponent, DetailComponent, EditorComponent, ActionStatus } from '@rero/ng-core';

import { CirculationPolicyComponent } from '../record/custom-editor/circulation-settings/circulation-policy/circulation-policy.component';
import { CircPoliciesBriefViewComponent } from '../record/brief-view/circ-policies-brief-view.component';
import { DocumentsBriefViewComponent } from '../record/brief-view/documents-brief-view.component';
import { LibraryComponent } from '../record/custom-editor/libraries/library.component';
import { LibrariesBriefViewComponent } from '../record/brief-view/libraries-brief-view.component';
import { PatronsBriefViewComponent } from '../record/brief-view/patrons-brief-view.component';
import { PersonsBriefViewComponent } from '../record/brief-view/persons-brief-view.component';
import { ItemTypesBriefViewComponent } from '../record/brief-view/item-types-brief-view.component';
import { PatronTypesBriefViewComponent } from '../record/brief-view/patron-types-brief-view.component';
import { DocumentEditorComponent } from '../document-editor/document-editor.component';

@Injectable({
  providedIn: 'root'
})
export class RecordRoutingService {

  constructor(
    private router: Router,
    private translateService: TranslateService
  ) { }

  initRoute() {
    this.router.config.push({
      matcher: (url) => this.routeMatcher(url, 'documents'),
      // loadChildren: () => import('@rero/ng-core').then(m => m.RecordModule)
      children: [
        { path: '', component: RecordSearchComponent },
        { path: 'detail/:pid', component: DetailComponent },
        { path: 'edit/:pid', component: EditorComponent },
        { path: 'new', component: DocumentEditorComponent }
      ],
      data: {
        linkPrefix: 'records',
        showSearchInput: false,
        types: [
          {
            key: 'documents',
            label: 'Documents',
            canDelete: (record) => this.canDelete(record),
            aggregations: (aggregations) => this.filter(aggregations),
            component: DocumentsBriefViewComponent
          }
        ]
      }
    }, {
      matcher: (url) => this.routeMatcher(url, 'libraries'),
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
            key: 'libraries',
            label: 'Libraries',
            component: LibrariesBriefViewComponent,
            canUpdate: (record) => this.canUpdate(record),
            canDelete: (record) => this.canDelete(record)
          }
        ]
      }
    }, {
      matcher: (url) => this.routeMatcher(url, 'patrons'),
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
            key: 'patrons',
            label: 'Patrons',
            component: PatronsBriefViewComponent
          }
        ]
      }
    }, {
      matcher: (url) => this.routeMatcher(url, 'persons'),
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
            key: 'persons',
            label: 'Persons',
            component: PersonsBriefViewComponent,
            canDelete: (record) => this.cant(),
            canAdd: (record) => this.cant(),
            canUpdate: (record) => this.cant()
          }
        ]
      }
    }, {
      matcher: (url) => this.routeMatcher(url, 'item_types'),
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
            key: 'item_types',
            label: 'Item Types',
            component: ItemTypesBriefViewComponent
          }
        ]
      }
    }, {
      matcher: (url) => this.routeMatcher(url, 'items'),
      children: [
        { path: 'detail/:pid', component: DetailComponent },
        { path: 'edit/:pid', component: EditorComponent },
        { path: 'new', component: EditorComponent }
      ],
      data: {
        linkPrefix: 'records',
        types: [
          {
            key: 'items',
            label: 'Items'
          }
        ]
      }
    }, {
      matcher: (url) => this.routeMatcher(url, 'locations'),
      children: [
        { path: 'detail/:pid', component: DetailComponent },
        { path: 'edit/:pid', component: EditorComponent },
        { path: 'new', component: EditorComponent }
      ],
      data: {
        linkPrefix: 'records',
        types: [
          {
            key: 'locations',
            label: 'Locations'
          }
        ]
      }
    }, {
      matcher: (url) => this.routeMatcher(url, 'patron_types'),
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
            key: 'patron_types',
            label: 'Patron Types',
            component: PatronTypesBriefViewComponent
          }
        ]
      }
    }, {
      matcher: (url) => this.routeMatcher(url, 'circ_policies'),
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
            key: 'circ_policies',
            label: 'Circulation Policies',
            component: CircPoliciesBriefViewComponent
          }
        ]
      }
    });
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

  private routeMatcher(url, type) {
    if (url[0].path === 'records' && url[1].path === type) {
      return this.matchedUrl(url);
    }
    return null;
  }

  private cant() {
    return of(false);
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
            aggs[splitted[0]] = aggregations[aggregation];
          }
        } else {
          aggs[aggregation] = aggregations[aggregation];
        }
      }
    });
    return aggs;
  }

  private canUpdate(record: any) {
    if (
      record.permissions
      && record.permissions.cannot_update
    ) {
      return of(false);
    }
    return of(true);
  }

  private canDelete(record: any): Observable<ActionStatus> {
    const obs = new Observable((observer: Subscriber<any>): void => {
      if (
        record.permissions
        && record.permissions.cannot_delete
        && record.permissions.cannot_delete.permission
        && record.permissions.cannot_delete.permission === 'permission denied') {
        observer.next({ can: false, message: '' });
      } else {
        observer.next({ can: !this.generateMessage(record), message: this.generateMessage(record) });
        this.translateService.onLangChange.subscribe(() => {
          observer.next({ can: !this.generateMessage(record), message: this.generateMessage(record) });
        });
      }
    });

    return obs;
  }

  private generateMessage(record: any) {
    if (('cannot_delete' in record.permissions)) {
      const translatePlural = new I18nPluralPipe(new NgLocaleLocalization(
        this.translateService.currentLang
      ));
      const messages = [];
      const cannotDelete = record.permissions.cannot_delete;
      if ('links' in cannotDelete) {
        const links = record.permissions.cannot_delete.links;
        const plurialdict = this.plurialLinksMessages();
        Object.keys(links).forEach(link => {
          let message = null;
          if ((link in plurialdict)) {
            message = translatePlural.transform(
              links[link],
              plurialdict[link],
              this.translateService.currentLang
            );
          } else {
            message = links[link][link] + ' ' + link;
          }
          messages.push('- ' + message);
        });
      }
      if ('others' in cannotDelete) {
        const plurialdict = this.othersMessages();
        Object.keys(cannotDelete.others).forEach(other => {
          if ((other in plurialdict)) {
            messages.push('- ' + plurialdict[other]);
          } else {
            messages.push('- ' + other);
          }
        });
      }
      messages.unshift(
        messages.length === 1 ?
          this.translateService.instant('You cannot delete the record for the following reason:') :
          this.translateService.instant('You cannot delete the record for the following reasons:')
      );

      return messages.join('\n');
    }

    return null;
  }

  private plurialLinksMessages() {
    return {
      circ_policies: {
        '=1': this.translateService.instant(_('has 1 circulation policy attached')),
        other: this.translateService.instant(_('has # circulation policies attached'))
      },
      documents: {
        '=1': this.translateService.instant(_('has 1 document attached')),
        other: this.translateService.instant(_('has # documents attached'))
      },
      item_types: {
        '=1': this.translateService.instant(_('has 1 item type attached')),
        other: this.translateService.instant(_('has # item types attached'))
      },
      items: {
        '=1': this.translateService.instant(_('has 1 item attached')),
        other: this.translateService.instant(_('has # items attached'))
      },
      libraries: {
        '=1': this.translateService.instant(_('has 1 library attached')),
        other: this.translateService.instant(_('has # libraries attached'))
      },
      loans: {
        '=1': this.translateService.instant(_('has 1 loan attached')),
        other: this.translateService.instant(_('has # loans attached'))
      },
      locations: {
        '=1': this.translateService.instant(_('has 1 location attached')),
        other: this.translateService.instant(_('has # locations attached'))
      },
      organisations: {
        '=1': this.translateService.instant(_('has 1 organisation attached')),
        other: this.translateService.instant(_('has # organisations attached'))
      },
      patron_types: {
        '=1': this.translateService.instant(_('has 1 patron type attached')),
        other: this.translateService.instant(_('has # patron types attached'))
      },
      patrons: {
        '=1': this.translateService.instant(_('has 1 patron attached')),
        other: this.translateService.instant(_('has # patrons attached'))
      }
    };
  }

  private othersMessages() {
    return {
      is_default: this.translateService.instant(_('The default record cannot be deleted')),
      has_settings: this.translateService.instant(_('The record contains settings')),
      harvested: this.translateService.instant(_('The record has been harvested'))
    };
  }
}
