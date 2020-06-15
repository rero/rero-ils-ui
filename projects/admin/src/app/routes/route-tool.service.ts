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
import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ActionStatus, ApiService, RecordService } from '@rero/ng-core';
import { Observable, of, Subscriber } from 'rxjs';
import { RecordPermission, RecordPermissionService } from '../service/record-permission.service';
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
   * @return recordPermissionService
   */
  get recordPermissionService() {
    return this._recordPermissionService;
  }

  /**
   * @return datePipe
   */
  get datePipe() {
    return this._datePipe;
  }

  /**
   * Constructor
   *
   * @param _translateService - TranslateService
   * @param _userService - UserService
   * @param _apiService - ApiService
   * @param _activatedRoute - ActivatedRoute
   * @param _recordService - RecordService
   * @param _recordPermissionService - RecordPermissionService
   * @param _datePipe - DatePipe
   */
  constructor(
    private _translateService: TranslateService,
    private _userService: UserService,
    private _apiService: ApiService,
    private _activatedRoute: ActivatedRoute,
    private _recordService: RecordService,
    private _recordPermissionService: RecordPermissionService,
    private _datePipe: DatePipe
  ) { }

  /**
   * Enabled action
   *
   * @param message - string
   * @return Observable
   */
  can(message: string = ''): Observable<ActionStatus> {
    return of({ can: true, message });
  }

  /**
   * Disabled action
   *
   * @param message - string
   * @return Observable
   */
  canNot(message: string = ''): Observable<ActionStatus> {
    return of({ can: false, message });
  }

  /**
   * Access only for system librarian
   *
   * @param message - string
   * @return Observable
   */
  canSystemLibrarian(message: string = ''): Observable<ActionStatus> {
    return of(
      { can: this._userService.hasRole('system_librarian'), message }
    );
  }

  /**
   * Check if a record can be updated
   *
   * @param record - Object: the resource object to check
   * @param recordType - String: the record type
   * @return Observable providing object with 2 attributes :
   *     - 'can' - Boolean: to know if the resource could be updated
   *     - 'message' - String: unused until now
   */
  canUpdate(record: any, recordType: string): Observable<ActionStatus> {
    return new Observable((observer: Subscriber<any>): void => {
      this._recordPermissionService
          .getPermission(recordType, record.metadata.pid)
          .subscribe((permission: RecordPermission) => {
            observer.next({can: permission.update.can, message: ''});
          });
    });
  }

  /**
   * Check if a record can be deleted
   *
   * @param record - Object: the resource object to check
   * @param recordType - String: the record type
   * @return Observable providing object with 2 attributes :
   *     - 'can' - Boolean: to know if the resource could be deleted
   *     - 'message' - String: the message to display if the record cannot be deleted
   */
  canDelete(record: any, recordType: string): Observable<ActionStatus> {
    return new Observable((observer: Subscriber<any>): void => {
      this._recordPermissionService
          .getPermission(recordType, record.metadata.pid)
          .subscribe((permission: RecordPermission) => {
            observer.next({
              can: permission.delete.can,
              message: (permission.delete.can)
                ? ''
                : this._recordPermissionService.generateDeleteMessage(permission.delete.reasons)
            });
          });
    });
  }

  /**
   * Aggregation filter
   *
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
   *
   * @param aggregations - Object
   * @return array
   */
  private aggFilter(aggregations: object) {
    const aggs = {};
    Object.keys(aggregations).map(aggregation => {
      if (aggregation.indexOf('__') > -1) {
        const splitted = aggregation.split('__');
        if (this._translateService.currentLang === splitted[1]) {
          aggs[aggregation] = aggregations[aggregation];
        }
      } else {
        aggs[aggregation] = aggregations[aggregation];
      }
    });
    return aggs;
  }

  /**
   * Get route param by name
   * Check the query string to found a requested parameter. If the param is not
   * part of the query string, return the default value specified as function parameter.
   *
   * @param name - string
   * @param defaultValue: the default value to return if name is not found as query parameter
   * @return mixed - string | null
   */
  getRouteQueryParam(name: string, defaultValue = null) {
    const queryParams = this._activatedRoute.snapshot.queryParams;
    return ( name in queryParams && queryParams[name].length > 0 )
      ? queryParams[name]
      : defaultValue;
  }
}
