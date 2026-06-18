// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormArray, Validators } from '@angular/forms';
import { TranslateDirective, TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Bind } from 'primeng/bind';
import { Button } from 'primeng/button';
import { DatePicker } from 'primeng/datepicker';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputNumber } from 'primeng/inputnumber';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { LibraryExceptionFormService } from '../library-exception-form.service';

@Component({
    selector: 'admin-libraries-exception-dates-edit',
    templateUrl: './exception-dates-edit.component.html',
    imports: [FormsModule, ReactiveFormsModule, Bind, InputText, TranslateDirective, Button, ToggleSwitch, InputNumber, Select, TitleCasePipe, TranslatePipe, DatePicker],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExceptionDatesEditComponent implements OnInit, OnDestroy {

  private dynamicDialogConfig: DynamicDialogConfig = inject(DynamicDialogConfig);
  private dynamicDialogRef: DynamicDialogRef = inject(DynamicDialogRef);
  protected formService: LibraryExceptionFormService = inject(LibraryExceptionFormService);
  private translateService: TranslateService = inject(TranslateService);

  readonly isSending = signal(false);

  periods: { label: string; value: string }[] = [
    {
      label: this.translateService.instant('week'),
      value: 'weekly'
    },
    {
      label: this.translateService.instant('month'),
      value: 'monthly'
    },
    {
      label: this.translateService.instant('year'),
      value: 'yearly'
    }
  ];

  ngOnInit() {
    const { exceptionDate } = this.dynamicDialogConfig.data;
    if (exceptionDate) {
      this.formService.populate(exceptionDate);
    }
  }

  ngOnDestroy(): void {
    this.dynamicDialogRef.destroy();
  }

  onSubmit(): void {
    if (this.isSending()) { return; }
    this.isSending.set(true);
    this.dynamicDialogRef.close(this.formService.getValue());
  }

  cancel(): void {
    this.dynamicDialogRef.close();
  }

  get times(): UntypedFormArray {
    return this.formService.form.get('times') as UntypedFormArray;
  }

  onPeriodChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = target.value === 'true';
    this.formService.form.get('is_period')!.setValue(value);
    if (value) {
      this.times.clear();
      this.formService.form.get('is_open')!.setValue(false);
    }
  }

  onDateStatusChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = target.value === 'true';
    this.formService.form.get('is_open')!.setValue(value);
  }

  onRepeatChange(event: { checked: boolean }): void {
    const interval = this.formService.form.get('interval')!;
    const period = this.formService.form.get('period')!;
    if (event.checked) {
      interval.setValue(1);
      interval.setValidators([Validators.required, Validators.min(1), Validators.pattern('^[0-9]*$')]);
      period.setValue('yearly');
    } else {
      interval.clearValidators();
      interval.setValue(null);
      period.setValue(null);
    }
  }

  addTime(): void {
    this.times.push(this.formService.buildTimes());
  }

  deleteTime(timeIndex: number): void {
    this.times.removeAt(timeIndex);
  }
}
