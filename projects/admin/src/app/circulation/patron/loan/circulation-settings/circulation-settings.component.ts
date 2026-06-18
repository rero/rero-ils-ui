// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DateTranslatePipe } from '@rero/ng-core';
import { MenuItem } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FixedDateFormComponent } from '../fixed-date-form/fixed-date-form.component';
import { CirculationStore, ICirculationSetting } from '../../../store/circulation.store';
import { LoanFixedDateService } from '@app/admin/circulation/services/loan-fixed-date.service';
import { Bind } from 'primeng/bind';
import { Menu } from 'primeng/menu';
import { Button } from 'primeng/button';

@Component({
    selector: 'admin-circulation-settings',
    templateUrl: './circulation-settings.component.html',
    providers: [DateTranslatePipe],
    imports: [Bind, Menu, Button],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CirculationSettingsComponent {

  private translateService: TranslateService = inject(TranslateService);
  private dialogService: DialogService = inject(DialogService);
  private dateTranslatePipe: DateTranslatePipe = inject(DateTranslatePipe);
  private store = inject(CirculationStore);
  private loanFixedDateService = inject(LoanFixedDateService);

  items: MenuItem[] = [
    {
      label: this.translateService.instant('Check-out for a fix date'),
      code: 'fix-date',
      command: () => this.openFixedEndDateDialog()
    },
    {
      label: this.translateService.instant('Override blockings'),
      code: 'override',
      command: () => this.overrideBlocking()
    }
  ];

  dialogRef: DynamicDialogRef | undefined;

  constructor() {
    const fixedDate = this.loanFixedDateService.get();
    if (fixedDate) {
      this.setCheckoutDateSetting(new Date(fixedDate), true);
    }
  }

  private openFixedEndDateDialog(): void {
    this.dialogRef = this.dialogService.open(FixedDateFormComponent, {
      header: this.translateService.instant('Choose a due date'),
      modal: true,
      focusOnShow: false,
      width: '30vw',
    });
    this.dialogRef.onClose.subscribe((result?: { action: string; content: { endDate: Date; remember: boolean } }) => {
      if (result && 'action' in result && result.action === 'submit') {
        this.setCheckoutDateSetting(result.content.endDate, result.content.remember);
      }
    });
  }

  private overrideBlocking(): void {
    this._setCheckoutSetting({
      key: 'overrideBlocking',
      label: this.translateService.instant('Override blockings'),
      value: true
    });
  }

  private setCheckoutDateSetting(endDate: Date, remember: boolean): void {
    endDate.setHours(23, 59);
    const formattedDate = this.dateTranslatePipe.transform(endDate, 'shortDate');
    const setting: ICirculationSetting = {
      key: 'endDate',
      label: this.translateService.instant('Active chosen due date: {{ endDate }}', { endDate: formattedDate }),
      value: endDate.toISOString(),
      extra: {
        remember,
        severity: remember ? 'success' : 'warn'
      }
    };
    this._setCheckoutSetting(setting);
  }

  private _setCheckoutSetting(setting: ICirculationSetting): void {
    this.store.removeSetting(setting.key);
    this.store.addSetting(setting);
  }
}
