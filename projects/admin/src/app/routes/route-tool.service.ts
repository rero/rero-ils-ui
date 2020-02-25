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
import { RecordPermission, RecordPermissionService } from '../service/record-permission.service';

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
   * @param _recordPermissionService - RecordPermissionService
   */
  constructor(
    private _translateService: TranslateService,
    private _recordPermissionMessageService: RecordPermissionMessageService,
    private _userService: UserService,
    private _apiService: ApiService,
    private _activatedRoute: ActivatedRoute,
    private _recordService: RecordService,
    private _recordPermissionService: RecordPermissionService
  ) { }

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
      { can: this._userService.hasRole('system_librarian'), message }
    );
  }

  /**
   * Can Add
   * @param record - Object
   * @return Observable
   */
  canUpdate(record: any, recordType: string): Observable<ActionStatus> {
    // TODO: Refactoring after all change in resource permission
    if ('documents' === recordType) {
      const obs = new Observable((observer: Subscriber<any>): void => {
        this._recordPermissionService
        .getPermission(recordType, record.metadata.pid)
        .subscribe((permission: RecordPermission) => {
          observer.next({ can: permission.update.can, message: '' });
        });
      });

      return obs;
    } else {
      if (record.permissions && record.permissions.cannot_update) {
        return this.canNot();
      }

      return this.can();
    }
  }

  /**
   * Can Delete
   * @param record - Object
   * @return Observable
   */
  canDelete(record: any, recordType: string): Observable<ActionStatus> {
    // TODO: Refactoring after all change in resource permission
    if ('documents' === recordType) {
      const obs = new Observable((observer: Subscriber<any>): void => {
        this._recordPermissionService
        .getPermission(recordType, record.metadata.pid)
        .subscribe((permission: RecordPermission) => {
          if (permission.delete.can) {
            observer.next({ can: permission.delete.can, message: '' });
          } else {
            observer.next({
              can: permission.delete.can,
              message: this._recordPermissionService.generateDeleteMessage(
                permission.delete.reasons
              )
            });
          }
        });
      });

      return obs;
    } else {
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
            can: !this._recordPermissionMessageService.generateMessage(record),
            message: this._recordPermissionMessageService.generateMessage(record)
          });
          this.translateService.onLangChange.subscribe(() => {
            observer.next({
              can: !this._recordPermissionMessageService.generateMessage(record),
              message: this._recordPermissionMessageService.generateMessage(record)
            });
          });
        }
      });

      return obs;
    }
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
   * @return array
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
