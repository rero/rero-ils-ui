/*
 * RERO ILS UI
 * Copyright (C) 2020-2024 RERO
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
import { inject } from '@angular/core';
import { UrlSegment } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { ActionStatus, extractIdOnRef } from '@rero/ng-core';
import { Observable, of } from 'rxjs';
import { RouteToolService } from './route-tool.service';

export class BaseRoute {

  protected routeToolService: RouteToolService = inject(RouteToolService);

  /** Disabled action */
  readonly DISABLED = (): Observable<ActionStatus> => of({
    can: false,
    message: ''
  })

  /**
   * Route matcher
   * @param url - any
   * @param type - string
   */
  routeMatcher(url: any, type: string) {
    if (url[0].path === 'records' && url[1].path === type) {
      return this.matchedUrl(url);
    }
    return null;
  }

  /**
   *
   * @param data object data
   * @param fields array of fields to remove
   * @returns object data
   */
  protected fieldsToRemoved(data: any, fields: string[]): any {
    fields.forEach((key: string) => {
      if (key in data) {
        delete data[key];
      }
    });
    return data;
  }

  /**
   * Matched url
   * @param url - UrlSegment
   */
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

  /**
   * Recursively remove a key of an object
   * @param data - object, the given object
   * @param key - string, the key to remove
   * @returns object, the object without the keys
   */
  removeKey(data: any, key: string) {
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
   * Return the redirect url with an observable
   * @param recordMetadata object - Record metadata
   * @param baseUrl string - absolute url entrypoint
   * @return observable
   */
  protected redirectUrl(recordMetadata: any, baseUrl: string) {
    const pid = ('$ref' in recordMetadata)
      ? extractIdOnRef(recordMetadata.$ref)
      : recordMetadata.pid;
    return of(`${baseUrl}/${pid}`);
  }

  /**
   * Expert search filter configuration
   * @return Object - Search filter configuration
   */
  protected expertSearchFilter() {
    return {
      label: _('Expert search'),
      filter: 'simple',
      value: '0',
      disabledValue: '1',
      persistent: true,
      // TODO: activate this part when the help is online
      // and correct the links of the help
      // url: {
      //   external: true,
      //   link: this._expertSearchLink(),
      //   title: this.routeToolService.translateService.instant('Link to expert search help')
      // }
    };
  }

  /**
   * Can read record
   * @param record - the record
   * @returns Observable boolean
   */
  protected canRead(record: any) {
    const organisationPid = this.routeToolService.userService.user
      .currentOrganisation;
    const recordOrganisationPid = ('organisation' in record.metadata)
      ? record.metadata.organisation.pid
      : false;
    return of({ can: organisationPid === recordOrganisationPid, message: '' });
  }

  /**
   * Expert search link
   * @return string, link of help page
   */
  private _expertSearchLink() {
    const defaultPath = 'help/recherche';
    const searchPaths = {
      fr: 'help/recherche'
      // TODO: Add other paths
    };
    const availableLanguages = Object.keys(searchPaths);
    return (this.routeToolService.translateService.currentLang in availableLanguages)
      ? searchPaths[this.routeToolService.translateService.currentLang]
      : defaultPath;
    }
 }

