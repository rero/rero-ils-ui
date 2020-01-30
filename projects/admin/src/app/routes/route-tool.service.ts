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
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { RecordPermissionMessageService } from '../service/record-permission-message.service';
import { of, Observable, Subscriber } from 'rxjs';
import { ActionStatus, ApiService, RecordService } from '@rero/ng-core';
import { UserService } from '../service/user.service';


@Injectable({
  providedIn: 'root'
})
export class RouteToolService {

  /**
   * @return TranslateService
   */
  get translateService() {
    return this._translateService;
  }

  /**
   * @return UserService
   */
  get userService() {
    return this._userService;
  }

  /**
   * @return ApiService
   */
  get apiService() {
    return this._apiService;
  }

  /**
   * @return ActivedRoute
   */
  get ActivatedRoute() {
    return this._activatedRoute;
  }

  /**
   * @return recordService
   */
  get recordService() {
    return this._recordService;
  }

  /**
   * Constructor
   * @param _translateService - TranslateService
   * @param _recordPermissionService - RecordPermissionMessageService
   * @param _userService - UserService
   * @param _apiService - ApiService
   * @param _activatedRoute - ActivatedRoute
   * @param _recordService - RecordService
   */
  constructor(
    private _translateService: TranslateService,
    private _recordPermissionService: RecordPermissionMessageService,
    private _userService: UserService,
    private _apiService: ApiService,
    private _activatedRoute: ActivatedRoute,
    private _recordService: RecordService
  ) { }

  /**
   * Can not to disabled action
   * @return Observable
   */
  canNot() {
    return of({ can: false, message: '' });
  }

  /**
   * Can Add System Librarian
   * @return Observable
   */
  canAddSystemLibrarian() {
    return of({
      can: this._userService.hasRole('system_librarian'),
      message: ''
    });
  }

  /**
   * Can Add
   * @param record - Object
   * @return Observable
   */
  canUpdate(record: any) {
    if (record.permissions && record.permissions.cannot_update) {
      return of({ can: false, message: '' });
    }
    return of({ can: true, message: '' });
  }

  /**
   * Can Delete
   * @param record - Object
   * @return Observable
   */
  canDelete(record: any): Observable<ActionStatus> {
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
          can: !this._recordPermissionService.generateMessage(record),
          message: this._recordPermissionService.generateMessage(record)
        });
        this.translateService.onLangChange.subscribe(() => {
          observer.next({
            can: !this._recordPermissionService.generateMessage(record),
            message: this._recordPermissionService.generateMessage(record)
          });
        });
      }
    });

    return obs;
  }

  /**
   * Aggregation filter
   * @param aggregations - Object
   */
  aggregationFilter(aggregations: object): Observable<any> {
    const obs = new Observable((observer: Subscriber<any>): void => {
      observer.next(this.aggFilter(aggregations));
      this._translateService.onLangChange.subscribe(() => {
        observer.next(this.aggFilter(aggregations));
      });
    });
    return obs;
  }

  /**
   * Aggregation filter
   * @param aggregations - Object
   */
  private aggFilter(aggregations: object) {
    const aggs = {};
    Object.keys(aggregations).map(aggregation => {
      if ('organisation' !== aggregation) {
        if (aggregation.indexOf('__') > -1) {
          const splitted = aggregation.split('__');
          if (this._translateService.currentLang === splitted[1]) {
            aggs[aggregation] = aggregations[aggregation];
          }
        } else {
          aggs[aggregation] = aggregations[aggregation];
        }
      }
    });
    return aggs;
  }

  /**
   * Get route param by name
   * @param name - string
   * @return mixed - string | null
   */
  getRouteQueryParam(name: string) {
    const queryParams = this._activatedRoute.snapshot.queryParams;
    if (name in queryParams) {
      return queryParams[name];
    }
    return null;
  }
}
