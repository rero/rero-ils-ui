// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { AsyncPipe, NgClass, NgPlural, NgPluralCase } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Bind } from '@openng/optimus-ui/bind';
import { Button } from '@openng/optimus-ui/button';
import { DialogService } from '@openng/optimus-ui/dynamicdialog';
import { DateTranslatePipe, GetRecordPipe } from '@rero/ng-core';
import { JoinPipe } from '@rero/shared';
import { filter, switchMap } from 'rxjs/operators';

import { RecordPermissionService } from '../../../service/record-permission.service';
import { CirculationStore } from '../../store/circulation.store';
import { ChangePasswordFormComponent } from '../change-password-form/change-password-form.component';

@Component({
  selector: 'admin-profile',
  templateUrl: './profile.component.html',
  imports: [
    NgClass,
    NgPlural,
    NgPluralCase,
    RouterLink,
    Bind,
    Button,
    AsyncPipe,
    DateTranslatePipe,
    GetRecordPipe,
    JoinPipe,
    TranslatePipe,
  ],
})
export class ProfileComponent {
  private dialogService: DialogService = inject(DialogService);
  private recordPermission: RecordPermissionService = inject(RecordPermissionService);
  private translateService: TranslateService = inject(TranslateService);
  private store = inject(CirculationStore);

  readonly patron = this.store.patron;
  private permissions = signal<any>(undefined);

  constructor() {
    toObservable(this.store.patron)
      .pipe(
        takeUntilDestroyed(),
        filter((patron): patron is any => !!patron),
        switchMap((patron) => this.recordPermission.getPermission('patrons', patron.pid)),
      )
      .subscribe((permissions) => this.permissions.set(permissions));
  }

  canUpdate() {
    const p = this.permissions();
    return p && p.update && p.update.can === true;
  }

  updatePatronPassword(patron: any) {
    this.dialogService.open(ChangePasswordFormComponent, {
      header: this.translateService.instant('Update Patron Password'),
      modal: true,
      focusOnShow: false,
      width: '30vw',
      data: { patron },
    });
  }
}
