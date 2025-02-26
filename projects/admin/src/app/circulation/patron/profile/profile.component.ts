/*
 * RERO ILS UI
 * Copyright (C) 2020-2025 RERO
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
import { DialogService } from 'primeng/dynamicdialog';
import { Subscription, switchMap, tap } from 'rxjs';
import { PatronService } from '../../../service/patron.service';
import { RecordPermissionService } from '../../../service/record-permission.service';
import { ChangePasswordFormComponent } from '../change-password-form/change-password-form.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'admin-profile',
    templateUrl: './profile.component.html',
    standalone: false
})
export class ProfileComponent implements OnInit, OnDestroy {

  private dialogService: DialogService = inject(DialogService);
  private patronService: PatronService = inject(PatronService);
  private recordPermission: RecordPermissionService = inject(RecordPermissionService);
  private translateService: TranslateService = inject(TranslateService);

  /** Current patron */
  patron: any;

  /** Observable subscription */
  private subscription = new Subscription();

  /** Patron permission */
  private permissions: any;

  ngOnInit() {
    this.subscription.add(
      this.patronService.currentPatron$.pipe(
        tap((patron: any) => this.patron = patron),
        switchMap((patron: any) => this.recordPermission.getPermission('patrons', patron.pid)),
        tap(permissions => this.permissions = permissions),
      ).subscribe()
    );
  }

  /**
   * Check the update permission.
   *
   * @returns True if the logged user can edit the current patron.
   */
  canUpdate() {
    return this.permissions && this.permissions.update && this.permissions.update.can === true;
  }

  /** Component destroy */
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  /**
   * Open a modal dialog with the new password.
   *
   * @param patron - Patron the patron to update the password.
   */
  updatePatronPassword(patron) {
    this.dialogService.open(ChangePasswordFormComponent, {
      header: this.translateService.instant('Update Patron Password'),
      focusOnShow: false,
      closable: true,
      width: '30vw',
      dismissableMask: true,
      data: {
        patron
      }
    });
  }
}
