/*
 * RERO ILS UI
 * Copyright (C) 2019 RERO
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


import { Injectable } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import { TimeValidator } from '@rero/ng-core';
import * as moment from 'moment';


@Injectable({
   providedIn: 'root'
})
export class LibraryExceptionFormService {

  public form;

  constructor( private fb: UntypedFormBuilder ) {
    this.build();
  }

  build() {
    this.form = this.fb.group({
      title: ['', [ Validators.required ]],
      date: [moment().toDate(), [ Validators.required ]],
      dates: [
        [moment().toDate(), moment().toDate()],
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

  populate(exception) {
    this.title.setValue(exception.title);
    if ('end_date' in exception) {
      this.is_period.setValue(true);
      this.dates.setValue([
        moment(exception.start_date, 'YYYY-MM-DD').toDate(),
        moment(exception.end_date, 'YYYY-MM-DD').toDate(),
      ]);
    } else {
      this.date.setValue(moment(exception.start_date, 'YYYY-MM-DD').toDate());
    }
    this.is_open.setValue(exception.is_open);
    if ('times' in exception) {
      exception.times.forEach(
        time => {
          this.times.push(this.buildTimes(time.start_time, time.end_time));
        }
      );
    }
    if ('repeat' in exception) {
      this.repeat.setValue(true);
      this.period.setValue(exception.repeat.period);
      this.interval.setValue(exception.repeat.interval);
      // this.data.setValue(exception.repeat.data)
    }
  }

  getValue() {
    return this.formatDateException(this.form.value);
  }

  formatDateException(data) {
    const dataException: any = {
      title: data.title,
      is_open: data.is_open
    };
    if (data.is_period) {
      dataException.start_date = moment(data.dates[0]).format('YYYY-MM-DD');
      dataException.end_date = moment(data.dates[1]).format('YYYY-MM-DD');
    } else {
      dataException.start_date = moment(data.date).format('YYYY-MM-DD');
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

  get title() { return this.form.get('title'); }
  get is_period() { return this.form.get('is_period'); }
  get is_open() { return this.form.get('is_open'); }
  get date() { return this.form.get('date'); }
  get dates() { return this.form.get('dates'); }
  get times() { return this.form.get('times'); }
  get repeat() { return this.form.get('repeat'); }
  get interval() { return this.form.get('interval'); }
  get period() { return this.form.get('period'); }
  get data() { return this.form.get('data'); }
}
