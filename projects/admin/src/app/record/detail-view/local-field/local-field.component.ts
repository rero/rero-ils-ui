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

import { Component, Input, OnInit } from '@angular/core';
import { JoinPipe, UserService } from '@rero/shared';
import { Observable, of } from 'rxjs';
import { LocalFieldApiService } from '../../../api/local-field-api.service';

@Component({
  selector: 'admin-local-field',
  templateUrl: './local-field.component.html',
  providers: [JoinPipe]
})
export class LocalFieldComponent implements OnInit {

  /** Resource Type */
  @Input() resourceType: string;

  /** Resource pid */
  @Input() resourcePid: string;

  /** Observable on record */
  record$: Observable<any>;

  /** Available resources type for local fields */
  resourcesType = {
    documents: 'doc',
    holdings: 'hold',
    items: 'item'
  };

  /**
   * Constructor
   * @param _localFieldApiService - LocalFieldApiService
   * @param _userService - UserService
   */
  constructor(
    private _localFieldApiService: LocalFieldApiService,
    private _userService: UserService
  ) { }

  /** Init */
  ngOnInit() {
    this.record$ = this._localFieldApiService.getByResourceTypeAndResourcePidAndOrganisationId(
      this._translateType(this.resourceType),
      this.resourcePid,
      this._userService.user.currentOrganisation
    );
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
   * @param resourceType - string, name of resource
   * @return string, resource symbol
   */
  private _translateType(resourceType: string) {
    if (resourceType in this.resourcesType) {
      return this.resourcesType[resourceType];
    }
    throw new Error(`Local fields: missing resource type ${resourceType}.`);
  }
}
