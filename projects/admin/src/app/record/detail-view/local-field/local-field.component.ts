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

import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { IPermissions, JoinPipe, PERMISSIONS, UserService } from '@rero/shared';
import { Observable, of, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { LocalFieldApiService } from '../../../api/local-field-api.service';
import { RecordPermissionService } from '../../../service/record-permission.service';

@Component({
  selector: 'admin-local-field',
  templateUrl: './local-field.component.html',
  providers: [JoinPipe]
})
export class LocalFieldComponent implements OnInit, OnDestroy {

  // COMPONENT ATTRIBUTES =====================================================
  /** Resource Type */
  @Input() resourceType: string;
  /** Resource pid */
  @Input() resourcePid: string;
  /** Observable on record */
  record$: Observable<any>;
  /** Available resources type for local fields */
  resourceTypes = {
    documents: 'doc',
    holdings: 'hold',
    items: 'item'
  };
  /** recordPermissions */
  recordPermissions: any;
  /** return all available permissions for current user */
  permissions: IPermissions = PERMISSIONS;

  /** all component subscription */
  private _subscriptions = new Subscription();

  // CONSTRUCTOR & HOOKS ======================================================
  /**
   * Constructor
   * @param _localFieldApiService - LocalFieldApiService
   * @param _userService - UserService
   * @param _recordPermissionService - RecordPermissionService
   */
  constructor(
    private _localFieldApiService: LocalFieldApiService,
    private _userService: UserService,
    private _recordPermissionService: RecordPermissionService
  ) { }

  /** OnInit hook */
  ngOnInit() {
    this.record$ = this._localFieldApiService.getByResourceTypeAndResourcePidAndOrganisationId(
      this._translateType(this.resourceType),
      this.resourcePid,
      this._userService.user.currentOrganisation
    );
    this.record$.subscribe((record) => {
      this._subscriptions.add(this._recordPermissionService
        .getPermission('local_fields', record.metadata.pid)
        .subscribe((permissions) => this.recordPermissions = permissions)
      );
    });
  }

  /** OnDestroy hook */
  ngOnDestroy() {
    this._subscriptions.unsubscribe()
  }

  /**
   * Delete
   */
  delete(resourcePid: string) {
    this._localFieldApiService.delete(resourcePid).subscribe((success: any) => {
      if (success) {
        this.record$ = of({});
      }
    });
  }

  /**
   * Translate resource type to symbol
   * @param typeOfResource - string: type of resource
   * @return string: resource symbol
   */
  private _translateType(typeOfResource: string) {
    if (typeOfResource in this.resourceTypes) {
      return this.resourceTypes[typeOfResource];
    }
    throw new Error(`Local fields: missing resource type ${typeOfResource}.`);
  }
}
