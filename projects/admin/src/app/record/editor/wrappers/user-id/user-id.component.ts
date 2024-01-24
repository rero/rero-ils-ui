/*
 * RERO ILS UI
 * Copyright (C) 2021-2024 RERO
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
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
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

  /**
   * constructor
   * @param modalService - ngx-bootstrap BsModalService
   * @param recordService - ng-core RecordService
   */
  constructor(
    private modalService: BsModalService,
    private recordService: RecordService
  ) {
    super();
  }

  /**
   * Get the user personal information to display in the editor.
   */
  ngOnInit(): void {
    if (this.formControl && this.formControl.value != null) {
      this.user$ = this.recordService.getRecord('users', this.formControl.value);
    }
  }

  /**
   * Open the modal with the User personal information editor.
   */
  openModal(): void {
    // return;
    this.modalRef = this.modalService.show(
      UserIdEditorComponent,
      {
        class: 'modal-lg',
        ignoreBackdropClick: true,
        initialState: { userID: this.formControl.value }
      });
    this.user$ = this.modalRef.onHidden.pipe(
      switchMap(() => {
        const { userID } = this.modalRef.content;
        if (userID != null) {
          this.formControl.setValue(userID);
          // need to force the role validation as the user can be changed
          this.formControl.root.get('roles').updateValueAndValidity();
          return this.recordService.getRecord('users', userID);
        }
        return of(null);
      })
    );
  }
}
