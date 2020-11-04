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
import { Component, OnDestroy, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { PatronService } from '../../../service/patron.service';
import { RecordPermissionService } from '../../../service/record-permission.service';
import { ChangePasswordFormComponent } from '../change-password-form/change-password-form.component';

@Component({
  selector: 'admin-profile',
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit, OnDestroy {

  /**
   * Current patron
   */
  currentPatron$;

  /** Observable subscription */
  private _subscription = new Subscription();

  /** Patron permission */
  private _permissions;

  /**
   * Constructor
   * @param _patronService - PatronService
   * @param _modalService - BsModalService
   * @param _recordPermission - RecordPermissionService
   */
  constructor(
    private _patronService: PatronService,
    private _modalService: BsModalService,
    private _recordPermission: RecordPermissionService
  ) {
  }

  /**
   * Component initialization.
   */
  ngOnInit() {
    this.currentPatron$ = this._patronService.currentPatron$;
    this._subscription = this.currentPatron$.subscribe(patron => {
      if (patron && patron.pid) {
        this._recordPermission.getPermission('patrons', patron.pid).subscribe(
          perm => {
            this._permissions = perm;
          }
        );
      }
    });
  }

  /**
   * Check the update permission.
   *
   * @returns True if the logged user can edit the current patron.
   */
  canUpdate() {
    return this._permissions && this._permissions.update && this._permissions.update.can === true;
  }

  /** Component destroy */
  ngOnDestroy() {
    this._subscription.unsubscribe();
  }

  /**
   * Open a modal dialog with the new password.
   *
   * @param patron - Patron the patron to update the password.
   */
  updatePatronPassword(patron) {
    const initialState = {
      patron
    };
    this._modalService.show(ChangePasswordFormComponent, { initialState });
  }
}
