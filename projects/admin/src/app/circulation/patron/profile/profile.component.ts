// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { DialogService } from 'primeng/dynamicdialog';
import { filter, switchMap } from 'rxjs/operators';
import { RecordPermissionService } from '../../../service/record-permission.service';
import { ChangePasswordFormComponent } from '../change-password-form/change-password-form.component';
import { TranslateService, TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { NgClass, NgPlural, NgPluralCase, AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Bind } from 'primeng/bind';
import { Button } from 'primeng/button';
import { DateTranslatePipe, GetRecordPipe } from '@rero/ng-core';
import { JoinPipe } from '@rero/shared';
import { CirculationStore } from '../../store/circulation.store';

@Component({
    selector: 'admin-profile',
    templateUrl: './profile.component.html',
    imports: [TranslateDirective, NgClass, NgPlural, NgPluralCase, RouterLink, Bind, Button, AsyncPipe, DateTranslatePipe, GetRecordPipe, JoinPipe, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent {

  private dialogService: DialogService = inject(DialogService);
  private recordPermission: RecordPermissionService = inject(RecordPermissionService);
  private translateService: TranslateService = inject(TranslateService);
  private store = inject(CirculationStore);

  readonly patron = this.store.patron;
  private permissions = signal<any>(undefined);

  constructor() {
    toObservable(this.store.patron).pipe(
      takeUntilDestroyed(),
      filter((patron): patron is any => !!patron),
      switchMap(patron => this.recordPermission.getPermission('patrons', patron.pid))
    ).subscribe(permissions => this.permissions.set(permissions));
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
      data: { patron }
    });
  }
}
