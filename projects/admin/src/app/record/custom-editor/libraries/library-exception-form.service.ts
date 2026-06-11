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
import { inject, Injectable } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import { TimeValidator } from '@rero/ng-core';
import { ExceptionDates } from '@app/admin/classes/library';
import { DateTime } from 'luxon';


@Injectable({
   providedIn: 'root'
})
export class LibraryExceptionFormService {

  private fb: UntypedFormBuilder = inject(UntypedFormBuilder);

  public form!: UntypedFormGroup;

  constructor() {
    this.build();
  }

  build() {
    const now = DateTime.now().toJSDate();
    this.form = this.fb.group({
      title: ['', [ Validators.required ]],
      date: [now, [ Validators.required ]],
      dates: [
        [now, now],
        [ Validators.required ]
      ],
      is_period: [false, [ Validators.required ]],
      is_open: [false, [ Validators.required ]],
      times: this.fb.array([]),
      repeat: [false],
      interval: [null],
      period: [null],
      data: this.fb.array([])
    }, {
      validators: [TimeValidator.RangePeriodValidator()]
    });
  }

  buildTimes(startTime = '00:00', endTime = '00:00'): UntypedFormGroup {
    return this.fb.group({
      start_time: [startTime, {
        validators: [
          Validators.required,
          Validators.pattern('^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$')
        ],
        updateOn: 'blur'
      }],
      end_time: [endTime, {
        validators: [
          Validators.required,
          Validators.pattern('^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$')
        ],
        updateOn: 'blur'
      }]
    }, {
      validators: TimeValidator.greaterThanValidator('start_time', 'end_time')
    });
  }

  buildRepeat(): UntypedFormGroup {
    return this.fb.group({
      interval: ['', [ Validators.required ]],
      period: ['', [ Validators.required ]],
      data: ['']
    });
  }

  populate(exception: ExceptionDates): void {
    this.form.get('title')!.setValue(exception.title);
    if (exception.end_date) {
      this.form.get('is_period')!.setValue(true);
      this.form.get('dates')!.setValue([
        DateTime.fromISO(exception.start_date as string).toJSDate(),
        DateTime.fromISO(exception.end_date as string).toJSDate(),
      ]);
    } else {
      this.form.get('date')!.setValue(DateTime.fromISO(exception.start_date as string).toJSDate());
    }
    this.form.get('is_open')!.setValue(exception.is_open);
    if (exception.times) {
      exception.times.forEach(time => {
        (this.form.get('times') as UntypedFormArray).push(this.buildTimes(time.start_time, time.end_time));
      });
    }
    if (exception.repeat) {
      this.form.get('repeat')!.setValue(true);
      this.form.get('period')!.setValue(exception.repeat.period);
      this.form.get('interval')!.setValue(exception.repeat.interval);
    }
  }

  getValue() {
    return this.formatDateException(this.form.value);
  }

  formatDateException(data: Record<string, any>): Record<string, any> {
    const dataException: any = {
      title: data.title,
      is_open: data.is_open
    };
    if (data.is_period) {
      dataException.start_date = DateTime.fromJSDate(data.dates[0]).toISODate();
      dataException.end_date = DateTime.fromJSDate(data.dates[1]).toISODate();
    } else {
      dataException.start_date = DateTime.fromJSDate(data.date).toISODate();
    }
    if (data.times.length > 0) {
      dataException.times = data.times;
    }
    if (data.repeat) {
      dataException.repeat = {
        interval: data.interval,
        period: data.period
      };
    }
    return dataException;
  }
}
