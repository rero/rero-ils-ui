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

import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';
import { RecordService } from '@rero/ng-core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable, of, Subscription } from 'rxjs';
import { UserIdEditorComponent } from '../../custom-editor/user-id-editor/user-id-editor.component';

@Component({
  selector: 'admin-user-id',
  template: `
  @if (user$ | async; as user) {
    <strong>
      {{ $any(user).metadata.last_name }}, {{ $any(user).metadata.first_name }}
      @if (user.metadata.city) {
        ({{ user.metadata.city }})
      }
    </strong>
    <p-button [label]="'Edit' |translate" [outlined]="true" (onClick)="openModal()"></p-button>
  } @else {
    <p-button [label]="'Create' |translate" [outlined]="true" (onClick)="openModal()"></p-button>
  }
  `
})
export class UserIdComponent extends FieldWrapper implements OnInit, OnDestroy {

  private dialogService: DialogService = inject(DialogService);
  private recordService: RecordService = inject(RecordService);

  /** current user */
  user$: Observable<any>;

  private subscription = new Subscription();

  /**
   * Get the user personal information to display in the editor.
   */
  ngOnInit(): void {
    if (this.formControl && this.formControl.value != null) {
      this.user$ = this.recordService.getRecord('users', this.formControl.value);
    }
  }

  ngOnDestroy(): void {
      this.subscription.unsubscribe();
  }

  /**
   * Open the modal with the User personal information editor.
   */
  openModal(): void {

    const ref: DynamicDialogRef = this.dialogService.open(UserIdEditorComponent, {
      dismissableMask: true,
      data: { userID: this.formControl.value }
    });
    this.subscription.add(
      ref.onClose.subscribe((userId?: string) => {
        if (userId) {
          this.formControl.setValue(userId);
          // need to force the role validation as the user can be changed
          this.formControl.root.get('roles').updateValueAndValidity();
          return this.recordService.getRecord('users', userId);
        } else {
          return of(null);
        }
      })
    );
  }
}
