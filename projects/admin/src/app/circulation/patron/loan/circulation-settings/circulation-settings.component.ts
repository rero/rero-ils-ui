/*
 * RERO ILS UI
 * Copyright (C) 2024 RERO
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
import { Component, inject, OnInit } from '@angular/core';
import { LoanFixedDateService } from '@app/admin/circulation/services/loan-fixed-date.service';
import { TranslateService } from '@ngx-translate/core';
import { DateTranslatePipe } from '@rero/ng-core';
import { MenuItem } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FixedDateFormComponent } from '../fixed-date-form/fixed-date-form.component';
import { CirculationSettingsService, ICirculationSetting } from './circulation-settings.service';

@Component({
  selector: 'admin-circulation-settings',
  templateUrl: './circulation-settings.component.html'
})
export class CirculationSettingsComponent implements OnInit {

  private translateService: TranslateService = inject(TranslateService);
  private dialogService: DialogService = inject(DialogService);
  private loanFixedDateService: LoanFixedDateService = inject(LoanFixedDateService);
  private dateTranslatePipe: DateTranslatePipe = inject(DateTranslatePipe);
  private circulationSettingsService: CirculationSettingsService = inject(CirculationSettingsService);

  items: MenuItem[] = [];

  dialogRef: DynamicDialogRef | undefined;

  ngOnInit(): void {
    this.items = [
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

    // Assignment of end date if present in locale storage
    const fixedDateValue = this.loanFixedDateService.get();
    if (fixedDateValue) {
      this.setCheckoutDateSetting(new Date(fixedDateValue), true);
    }
  }

  private openFixedEndDateDialog(): void {
    this.dialogRef = this.dialogService.open(FixedDateFormComponent, {
      header: this.translateService.instant('Choose a due date'),
      width: '30vw',
      height: '600px'
    });
    this.dialogRef.onClose.subscribe((result?: any) => {
      if (result && 'action' in result && result.action === 'submit') {
        const date = this.setCheckoutDateSetting(result.content.endDate, result.content.remember);
        if (result.content.remember) {
          this.loanFixedDateService.set(date);
        }
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

  private setCheckoutDateSetting(endDate: Date, remember: boolean): string {
    endDate.setHours(23,59);
    const formattedDate = this.dateTranslatePipe.transform(endDate, 'shortDate');
    const setting = {
      key: 'endDate',
      label: this.translateService.instant('Active chosen due date: {{ endDate }}', {endDate: formattedDate}),
      value: endDate.toISOString(),
      extra: {
        remember,
        severity: remember ? 'success' : 'warning'
      }
    };
    this._setCheckoutSetting(setting);

    return setting.value;
  }

  private _setCheckoutSetting(setting: ICirculationSetting) {
    this.circulationSettingsService.remove(setting.key);
    this.circulationSettingsService.add(setting);
  }
}
