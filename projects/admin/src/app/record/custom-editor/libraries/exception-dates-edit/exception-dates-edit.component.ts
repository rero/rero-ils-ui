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

import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { LibraryExceptionFormService } from '../library-exception-form.service';

@Component({
  selector: 'admin-libraries-exception-dates-edit',
  templateUrl: './exception-dates-edit.component.html',
  styles: []
})
export class ExceptionDatesEditComponent implements OnInit {

  @Input() exceptionDate: any;
  value = new Subject();
  public exceptionForm: UntypedFormGroup;

  constructor(
    public localeService: BsLocaleService,
    public bsModalRef: BsModalRef,
    public form: LibraryExceptionFormService,
    private translate: TranslateService
  ) {
    this.form.build();
    this.exceptionForm = this.form.form;
    this.localeService.use(this.translate.currentLang);
  }

  ngOnInit() {
    if (this.exceptionDate) {
      this.form.populate(this.exceptionDate);
    }
  }

  onSubmit() {
    this.bsModalRef.hide();
    this.value.next(this.form.getValue());
  }

  onCancel() {
    this.bsModalRef.hide();
  }

  onPeriodChange(event) {
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

  onDateStatusChange(event) {
    const { target } = event;
    const value = target.value === 'true';
    this.form.is_open.setValue(value);
  }

  onRepeatChange(repeat) {
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
