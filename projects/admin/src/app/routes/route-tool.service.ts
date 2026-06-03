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
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AbstractType, inject, Injectable, InjectionToken, Injector, Type } from '@angular/core';
import { ActivatedRoute, Router, UrlSerializer } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ActionStatus, ApiService, RecordService } from '@rero/ng-core';
import type { JsonObject, RecordData } from '@rero/ng-core';
import { AppStore } from '@rero/shared';
import { Observable, of, Subscriber } from 'rxjs';
import { map } from 'rxjs/operators';
import { RecordPermissions } from '../classes/permissions';
import { RecordPermissionService } from '../service/record-permission.service';

@Injectable({
  providedIn: "root",
})
export class RouteToolService {

  injector: Injector = inject(Injector);

  /**
   * Proxy for app store
   * @return AppStore
   */
  get appStore() {
    return this.injector.get(AppStore);
  }

  /**
   * Proxy for translate service
   * @return TranslateService
   */
  get translateService() {
    return this.injector.get(TranslateService);
  }

  /**
   * Proxy for api service
   * @return ApiService
   */
  get apiService() {
    return this.injector.get(ApiService);
  }

  /**
   * Proxy for activated route
   * @return ActivatedRoute
   */
  get activatedRoute() {
    return this.injector.get(ActivatedRoute);
  }

  /**
   * Proxy for record service
   * @return recordService
   */
  get recordService() {
    return this.injector.get(RecordService);
  }

  /**
   * Proxy for record permission service
   * @return recordPermissionService
   */
  get recordPermissionService() {
    return this.injector.get(RecordPermissionService);
  }

  /**
   * Proxy for date pipe
   * @return datePipe
   */
  get datePipe() {
    return this.injector.get(DatePipe);
  }

  /**
   * Proxy for router
   * @return router
   */
  get router() {
    return this.injector.get(Router);
  }

  /**
   * Proxy for url serializer
   * @return urlSerializer
   */
  get urlSerializer() {
    return this.injector.get(UrlSerializer);
  }

  /**
   * Proxy for http client
   * @return httpClient
   */
  get httpClient() {
    return this.injector.get(HttpClient);
  }

  /**
   * Get Token in injector
   * @param token - Token
   */
  getInjectorToken<T>(token: Type<T> | InjectionToken<T> | AbstractType<T>) {
    return this.injector.get(token);
  }

  /**
   * Enabled action
   * @param message - string
   * @return Observable
   */
  can(message = ""): Observable<ActionStatus> {
    return of({ can: true, message });
  }

  /**
   * Disabled action
   * @param message - string
   * @return Observable
   */
  canNot(message = ""): Observable<ActionStatus> {
    return of({ can: false, message });
  }

  /**
   * Check if a record can be updated
   * @param record - Object: the resource object to check
   * @param recordType - String: the record type
   * @return Observable providing object with 2 attributes :
   *     - 'can' - Boolean: to know if the resource could be updated
   *     - 'message' - String: unused until now
   */
  canUpdate(record: RecordData, recordType: string): Observable<ActionStatus> {
    return new Observable((observer: Subscriber<ActionStatus>): void => {
      this.recordPermissionService
        .getPermission(recordType, record.metadata['pid'] as string)
        .subscribe((permission: RecordPermissions) => {
          observer.next({ can: permission.update?.can ?? false, message: "" });
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
  canDelete(record: RecordData, recordType: string): Observable<ActionStatus> {
    return new Observable((observer: Subscriber<ActionStatus>): void => {
      this.recordPermissionService
        .getPermission(recordType, record.metadata['pid'] as string)
        .subscribe((permission: RecordPermissions) => {
          const canDelete = permission.delete?.can ?? false;
          observer.next({
            can: canDelete,
            message: canDelete
              ? ""
              : this.recordPermissionService.generateTooltipMessage(
                  (permission.delete?.reasons ?? {}) as unknown as JsonObject,
                  'delete'
                ),
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
  canRead(record: RecordData, recordType: string): Observable<ActionStatus> {
    return new Observable((observer: Subscriber<ActionStatus>): void => {
      this.recordPermissionService
        .getPermission(recordType, record.metadata['pid'] as string)
        .subscribe((permission: RecordPermissions) => {
          observer.next({ can: permission.read?.can ?? false, message: "" });
        });
    });
  }

  /**
   * Check all permissions of the record
   * @param record - Object: the resource object to check
   * @param recordType - String: the record type
   * @param membership - boolean: Check if the record is in the same library
   * @return Observable providing object contains:
   *      - canRead permission
   *      - canUpdate permission
   *      - canDelete permission
   */
  permissions(record: RecordData, recordType: string, membership = false): Observable<Record<string, ActionStatus>> {
    return this.recordPermissionService
      .getPermission(recordType, record.metadata['pid'] as string)
        .pipe(
          map((permission: RecordPermissions) => {
            if (membership && "library" in record.metadata) {
              const library = record.metadata['library'] as Record<string, string>;
              const libraryPid = ("$ref" in library
                ? library['$ref'].split("/").pop()
                : library['pid']) ?? '';
              permission = this.recordPermissionService.membership(
                this.appStore.currentLibraryPid(),
                libraryPid,
                permission
              );
            }
            const canDelete = permission.delete?.can ?? false;
            return {
              canRead: { can: permission.read?.can ?? false, message: "" },
              canUpdate: { can: permission.update?.can ?? false, message: "" },
              canDelete: {
                can: canDelete,
                message: canDelete
                  ? ""
                  : this.recordPermissionService.generateTooltipMessage(
                      (permission.delete?.reasons ?? {}) as unknown as JsonObject,
                      'delete'
                    ),
              },
            };
          })
        );
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
    const { queryParams } = this.activatedRoute.snapshot;
    return name in queryParams && queryParams[name].length > 0
      ? queryParams[name]
      : defaultValue;
  }
}
