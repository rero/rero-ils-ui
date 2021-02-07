/*
 * RERO ILS UI
 * Copyright (C) 2021 RERO
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

import { Component, OnInit } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';
import { RecordService } from '@rero/ng-core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable, Subscription } from 'rxjs';
import { UserIdEditorComponent } from '../../../custom-editor/user-id-editor/user-id-editor.component';

@Component({
  selector: 'admin-user-id',
  templateUrl: './user-id.component.html'
})
export class UserIdComponent extends FieldWrapper implements OnInit {

  /** User component to open in a modal */
  modalRef: BsModalRef;

  /** current user */
  user$: Observable<any>;

  /** Modal observable subscription */
  private _subscription = new Subscription();

  /**
   * constructor
   * @param _modalService - ngx-boostrap BsModalService
   * @param _recordService - ng-core RecordService
   */
  constructor(
    private _modalService: BsModalService,
    private _recordService: RecordService) {
    super();
  }

  /**
   * Get the user personal information to display in the editor.
   */
  ngOnInit(): void {
    console.log(this.formControl.value);
    if (this.formControl && this.formControl.value != null) {
      this.user$ = this._recordService.getRecord('users', this.formControl.value);
    }
  }

  /**
   * Open the modal with the User personal information editor.
   */
  openModal(): void {
    this.modalRef = this._modalService.show(
      UserIdEditorComponent,
      {
        class: 'modal-lg',
        initialState: { userID: this.formControl.value }
      });
    this._subscription = this.modalRef.onHide.subscribe(() => {
      const userID = this.modalRef.content.userID;
      if (userID != null) {
        this.formControl.setValue(this.modalRef.content.userID);
        this.user$ = this._recordService.getRecord('users', this.formControl.value);
      }
      this._subscription.unsubscribe();
    });
  }
}
