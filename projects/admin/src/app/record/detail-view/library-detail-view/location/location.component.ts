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
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RecordUiService } from '@rero/ng-core';
import { RecordPermissionService } from 'projects/admin/src/app/service/record-permission.service';

@Component({
  selector: 'admin-location',
  templateUrl: './location.component.html'
})
export class LocationComponent implements OnInit {

  /** The location whose details are displayed */
  @Input() location: any;

  /** The parent library of the location */
  @Input() library: any;

  /** Delete location event emitter */
  @Output() deleteLocation = new EventEmitter();

  /** location record permission */
  permissions: any;

  /**
   * Constructor
   * @param _recordUiService: RecordUiService
   * @param _recordPermissionService: RecordPermissionService
   */
  constructor(
    private _recordUiService: RecordUiService,
    private _recordPermissionService: RecordPermissionService
  ) { }

  /**
   * Init
   */
  ngOnInit() {
    this._recordPermissionService.getPermission('locations', this.location.metadata.pid).subscribe(
      (permissions) => this.permissions = permissions
    );
  }

  /**
   * Delete the location
   * @param locationPid - location PID
   */
  delete(locationPid: string) {
    this._recordUiService.deleteRecord('locations', locationPid).subscribe((success: boolean) => {
      if (success) {
        this.deleteLocation.emit(locationPid);
      }
    });
  }

  /**
   * Return a message containing the reasons wht the item cannot be requested
   */
  get deleteInfoMessage(): string {
    return this._recordPermissionService.generateDeleteMessage(this.permissions.delete.reasons);
  }

}
