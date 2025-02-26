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

import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';
import { TranslateService } from '@ngx-translate/core';
import { RecordService } from '@rero/ng-core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { of, Subscription, switchMap } from 'rxjs';
import { UserIdEditorComponent } from '../../custom-editor/user-id-editor/user-id-editor.component';

@Component({
    selector: 'admin-user-id',
    template: `
    <div class="flex gap-2 items-center mb-6">
      @if (user) {
        <strong>
          {{ $any(user).metadata.last_name }}, {{ $any(user).metadata.first_name }}
          @if (user.metadata.city) {
            ({{ user.metadata.city }})
          }
        </strong>
        <p-button size="small" [label]="'Edit' | translate" outlined (onClick)="openModal()" />
      } @else {
        <p-button size="small" [label]="'Create' | translate" outlined (onClick)="openModal()" />
      }
    </div>
  `,
    standalone: false
})
export class UserIdComponent extends FieldWrapper implements OnInit, OnDestroy {
  private dialogService: DialogService = inject(DialogService);
  private recordService: RecordService = inject(RecordService);
  private translateService: TranslateService = inject(TranslateService);
  private changeDetectorRef: ChangeDetectorRef = inject(ChangeDetectorRef);

  /** current user */
  user;

  private subscription = new Subscription();

  /**
   * Get the user personal information to display in the editor.
   */
  ngOnInit(): void {
    if (this.formControl && this.formControl.value != null) {
      this.recordService.getRecord('users', this.formControl.value).subscribe((user) => {
        this.user = user;
        this.changeDetectorRef.detectChanges();
      });
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
      header: this.translateService.instant('Personal informations'),
      focusOnShow: false,
      closable: true,
      width: '60vw',
      data: { userID: this.formControl.value },
    });
    this.subscription.add(
      ref.onClose
        .pipe(
          switchMap((userId?: string) => {
            if (userId) {
              this.formControl.setValue(userId);
              // need to force the role validation as the user can be changed
              this.formControl.root.get('roles').updateValueAndValidity();
              return this.recordService.getRecord('users', userId);
            }
            return of(null);
          })
        )
        .subscribe((user) => {
          if (user) {
            this.user = user;
          }
        })
    );
  }
}
