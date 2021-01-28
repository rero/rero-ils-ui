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
import { HttpClient } from '@angular/common/http';
import { AbstractType, Injectable, InjectionToken, Injector, Type } from '@angular/core';
import { ActivatedRoute, Router, UrlSerializer } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ActionStatus, ApiService, RecordService } from '@rero/ng-core';
import { UserService } from '@rero/shared';
import { Observable, of, Subscriber } from 'rxjs';
import { RecordPermission, RecordPermissionService } from '../service/record-permission.service';

@Injectable({
  providedIn: 'root'
})
export class RouteToolService {

  /**
   * Proxy for translate service
   * @return TranslateService
   */
  get translateService() {
    return this._injector.get(TranslateService);
  }

  /**
   * Proxy for user service
   * @return UserService
   */
  get userService() {
    return this._injector.get(UserService);
  }

  /**
   * Proxy for api service
   * @return ApiService
   */
  get apiService() {
    return this._injector.get(ApiService);
  }

  /**
   * Proxy for actived route
   * @return ActivedRoute
   */
  get activatedRoute() {
    return this._injector.get(ActivatedRoute);
  }

  /**
   * Proxy for record service
   * @return recordService
   */
  get recordService() {
    return this._injector.get(RecordService);
  }

  /**
   * Proxy for record permission service
   * @return recordPermissionService
   */
  get recordPermissionService() {
    return this._injector.get(RecordPermissionService);
  }

  /**
   * Proxy for date pipe
   * @return datePipe
   */
  get datePipe() {
    return this._injector.get(DatePipe);
  }

  /**
   * Proxy for router
   * @return router
   */
  get router() {
    return this._injector.get(Router);
  }

  /**
   * Proxy for url serializer
   * @return urlSerializer
   */
  get urlSerializer() {
    return this._injector.get(UrlSerializer);
  }

  /**
   * Proxy for http client
   * @return httpClient
   */
  get httpClient() {
    return this._injector.get(HttpClient);
  }

  /**
   * Proxy for injector
   * @return Injector
   */
  get injector() {
    return this._injector;
  }

  /**
   * Constructor
   * @param _injector - Injector
   */
  constructor(private _injector: Injector) { }

  /**
   * Get Token in injector
   * @param token - Token
   */
  getInjectorToken<T>(token: Type<T> | InjectionToken<T> | AbstractType<T>) {
    return this._injector.get(token);
  }

  /**
   * Enabled action
   * @param message - string
   * @return Observable
   */
  can(message: string = ''): Observable<ActionStatus> {
    return of({ can: true, message });
  }

  /**
   * Disabled action
   * @param message - string
   * @return Observable
   */
  canNot(message: string = ''): Observable<ActionStatus> {
    return of({ can: false, message });
  }

  /**
   * Access only for system librarian
   * @param message - string
   * @return Observable
   */
  canSystemLibrarian(message: string = ''): Observable<ActionStatus> {
    return of(
      { can: this.userService.user.isSystemLibrarian, message }
    );
  }

  /**
   * Check if a record can be updated
   * @param record - Object: the resource object to check
   * @param recordType - String: the record type
   * @return Observable providing object with 2 attributes :
   *     - 'can' - Boolean: to know if the resource could be updated
   *     - 'message' - String: unused until now
   */
  canUpdate(record: any, recordType: string): Observable<ActionStatus> {
    return new Observable((observer: Subscriber<any>): void => {
      this.recordPermissionService
          .getPermission(recordType, record.metadata.pid)
          .subscribe((permission: RecordPermission) => {
            observer.next({ can: permission.update.can, message: '' });
          });
    });
  }

  /**
   * Check if a record can be deleted
   * @param record - Object: the resource object to check
   * @param recordType - String: the record type
   * @return Observable providing object with 2 attributes :
   *     - 'can' - Boolean: to know if the resource could be deleted
   *     - 'message' - String: the message to display if the record cannot be deleted
   */
  canDelete(record: any, recordType: string): Observable<ActionStatus> {
    return new Observable((observer: Subscriber<any>): void => {
      this.recordPermissionService
          .getPermission(recordType, record.metadata.pid)
          .subscribe((permission: RecordPermission) => {
            observer.next({
              can: permission.delete.can,
              message: (permission.delete.can)
                ? ''
                : this.recordPermissionService.generateDeleteMessage(permission.delete.reasons)
            });
          });
    });
  }


  /**
   * Check if a record can be read
   * @param record - Object: the resource object to check
   * @param recordType - String: the record type
   * @return Observable providing object with 2 attributes :
   *     - 'can' - Boolean: to know if the resource could be readable
   *     - 'message' - String: unused until now
   */
  canRead(record: any, recordType: string): Observable<ActionStatus> {
    return new Observable((observer: Subscriber<any>): void => {
      this.recordPermissionService
        .getPermission(recordType, record.metadata.pid)
        .subscribe((permission: RecordPermission) => {
          observer.next({ can: permission.read.can, message: '' });
        });
    });
  }

  /**
   * Check all permissions of the record
   * @param record - Object: the resource object to check
   * @param recordType - String: the record type
   * @return Observable providing object contains:
   *      - canRead permission
   *      - canUpdate permission
   *      - canDelete permission
   */
  permissions(record: any, recordType: string): Observable<any> {
    return new Observable((observer: Subscriber<any>): void => {
      this.recordPermissionService
        .getPermission(recordType, record.metadata.pid)
        .subscribe((permission: RecordPermission) => {
          observer.next({
            canRead: { can: permission.read.can, message: '' },
            canUpdate: { can: permission.update.can, message: '' },
            canDelete: {
              can: permission.delete.can,
              message: (permission.delete.can)
              ? ''
              : this.recordPermissionService.generateDeleteMessage(permission.delete.reasons)
            },
          });
        });
    });
  }

  /**
   * Get route param by name
   * Check the query string to found a requested parameter. If the param is not
   * part of the query string, return the default value specified as function parameter.
   * @param name - string
   * @param defaultValue: the default value to return if name is not found as query parameter
   * @return mixed - string | null
   */
  getRouteQueryParam(name: string, defaultValue = null) {
    const queryParams = this.activatedRoute.snapshot.queryParams;
    return (name in queryParams && queryParams[name].length > 0)
      ? queryParams[name]
      : defaultValue;
  }

  /**
   * Aggregation filter
   * @param aggregations - Object
   * @return Observable
   */
  aggregationFilter(aggregations: object): Observable<any> {
    const obs = new Observable((observer: Subscriber<any>): void => {
      observer.next(this._aggFilter(aggregations));
      this.translateService.onLangChange.subscribe(() => {
        observer.next(this._aggFilter(aggregations));
      });
    });
    return obs;
  }

  /**
   * Aggregation filter
   * @param aggregations - Object
   * @return array
   */
  private _aggFilter(aggregations: object) {
    const aggs = {};
    Object.keys(aggregations).map(aggregation => {
      if (aggregation.indexOf('__') > -1) {
        const splitted = aggregation.split('__');
        if (this.translateService.currentLang === splitted[1]) {
          aggs[aggregation] = aggregations[aggregation];
        }
      } else {
        aggs[aggregation] = aggregations[aggregation];
      }
    });
    return aggs;
  }
}
