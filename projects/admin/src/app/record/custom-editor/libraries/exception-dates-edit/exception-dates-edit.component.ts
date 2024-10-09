/*
 * RERO ILS UI
 * Copyright (C) 2019-2024 RERO
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
import { UntypedFormArray, UntypedFormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { LibraryExceptionFormService } from '../library-exception-form.service';

@Component({
  selector: 'admin-libraries-exception-dates-edit',
  templateUrl: './exception-dates-edit.component.html',
  styles: []
})
export class ExceptionDatesEditComponent implements OnInit, OnDestroy {

  private dynamicDialogConfig: DynamicDialogConfig = inject(DynamicDialogConfig);
  private dynamicDialogRef: DynamicDialogRef = inject(DynamicDialogRef);
  private form: LibraryExceptionFormService = inject(LibraryExceptionFormService);

  public exceptionForm: UntypedFormGroup;

  ngOnInit() {
    this.form.build();
    this.exceptionForm = this.form.form;
    const { exceptionDate } = this.dynamicDialogConfig.data;
    if (exceptionDate) {
      this.form.populate(exceptionDate);
    }
  }

  ngOnDestroy(): void {
    this.dynamicDialogRef.destroy();
  }

  onSubmit() {
    this.dynamicDialogRef.close(this.form.getValue());
  }

  onCancel(): void {
    this.dynamicDialogRef.close();
  }

  onPeriodChange(event): void {
    const { target } = event;
    const value = target.value === 'true';
    this.form.is_period.setValue(value);
    if (value) {
      for (let i = 0; i < this.form.times.length; i++) {
        this.form.times.removeAt(i);
      }
      this.form.is_open.setValue(false);
    }
  }

  onDateStatusChange(event): void {
    const { target } = event;
    const value = target.value === 'true';
    this.form.is_open.setValue(value);
  }

  onRepeatChange(repeat): void {
    if (repeat) {
      this.form.interval.setValue(1);
      this.form.interval.setValidators([
        Validators.required,
        Validators.min(1),
        Validators.pattern('^[0-9]*$')
      ]);
      this.form.period.setValue('yearly');
    } else {
      this.form.interval.clearValidators();
      this.form.interval.setValue(null);
      this.form.period.setValue(null);
    }
  }

  addTime(): void {
    this.form.times.push(this.form.buildTimes());
  }

  deleteTime(timeIndex): void {
    this.form.times.removeAt(timeIndex);
  }

  get title() { return this.form.title; }
  get is_period() { return this.form.is_period; }
  get is_open() { return this.form.is_open; }
  get date() { return this.form.date; }
  get dates() { return this.form.dates; }
  get times() { return this.form.times as UntypedFormArray; }
  get repeat() { return this.form.repeat; }
  get interval() { return this.form.interval; }
  get period() { return this.form.period; }
  get data() { return this.data as UntypedFormArray; }
}
