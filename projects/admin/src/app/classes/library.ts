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

/* tslint:disable */
// required as json properties is not lowerCamelCase

import { WeekDay } from '@angular/common';
import { NotificationType } from './notification';
import { WeekDays } from './week-days';
import { DateTime } from 'luxon';


export interface OpeningHours {
  day: string;
  is_open: boolean;
  times: Array<Hours>;
}

export interface Repeat {
  interval: number;
  period: string;
  data: Array<number>;
}

export interface Hours {
  start_time: string;
  end_time: string;
}

export interface Organisation {
  $ref: string;
}

export interface ExceptionDates {
  title: string;
  is_open: boolean;
  start_date: string | DateTime;
  end_date?: string | DateTime;
  times?: Array<Hours>;
  repeat?: Repeat;
}

export interface NotificationSettings {
  type: NotificationType;
  email: string;
  delay?: number;
}

export interface AcquisitionInformations {
  shipping_informations: AcquisitionInformationDetail;
  billing_informations?: AcquisitionInformationDetail;
}

export interface AcquisitionInformationDetail {
  name: string;
  email?: string;
  phone?: string;
  extra?: string;
  address: Address;
}

export interface Address {
  street: string;
  zip_code: string;
  city: string;
  country: string;
}

export interface RolloverSettings {
  account_transfer: string
}

export class Library {

  // CLASS ATTRIBUTES ================================================
  $schema: string = null;
  pid: string = null;
  name: string = null;
  email: string = null;
  address: string = null;
  code: string = null;
  communication_language: string = null;
  opening_hours: Array<OpeningHours> = [];
  exception_dates?: Array<ExceptionDates>;
  notification_settings?: Array<NotificationSettings>;
  acquisition_settings?: AcquisitionInformations;
  serial_acquisition_settings?: AcquisitionInformations;
  organisation: Organisation;
  rollover_settings: RolloverSettings;

  // GETTER & SETTER ================================================
  /** Allow to get all closed days for the library */
  get closedDays(): Array<WeekDay> {
    return this.opening_hours
      .filter(day => !day.is_open)
      .map(day => Library.convertDayToWeekDay(day.day))
      .filter(day => day !== null);
  }

  // CONSTRUCTOR ===================================================
  /**
   * Constructor
   * @param obj - the metadata to use to create a Library object.
   */
  constructor(obj?: any) {
    this._initOpeningHours();
    if (obj) {
      this.update(obj);
    }
    if (!this.exception_dates) {
      this.exception_dates = [];
    }
    // exception dates
    //   * For repeatable exception dates (these exceptions are never over), we will compute the next valid date/period.
    //   * At the end, for user best comprehension, the exception dates list will be sorted on event start date for more
    //     readability for users.
    this.exception_dates = this.exception_dates.map((exception) => {
      if (exception.repeat){
        while(Library.isExceptionDateOver(exception, false)) {
          exception = Library._incrementExceptionDate(exception);
        }
      }
      return exception;
    });
    this.exception_dates = this.exception_dates.sort((a, b) => DateTime.fromISO(a.start_date) - DateTime.fromISO(b.start_date));
  }

  /**
   * Update the library
   * @param obj - the metadata to use to create a Library object.
   */
  update(obj) {
    Object.assign(this, obj);
    this._cleanOpeningHours();
    this._reorderOpeningHours();
    this._cleanAcquisitionSettings();
  }

  /**
   * Check if an exception is obsolete or not.
   *
   * An exception date is over when it is not repeatable (repeatable exceptions
   * are never over) and when end_date/start_date is passed depending of
   * availability of `end_date` field for this exception.
   * @param exception - The exception date/period to check.
   * @param checkRepeat - is the repeat field is checked or not ?
   *                      If not then, only check about exception dates
   * @returns boolean is the exception is over or not.
   */
  static isExceptionDateOver(exception: ExceptionDates, checkRepeat: boolean = true): boolean {
    if (exception.repeat && checkRepeat) {
      return false;
    }
    const checked_date = (exception.end_date) ? DateTime.fromISO(exception.end_date) : DateTime.fromISO(exception.start_date);
    return checked_date < DateTime.now();
  }

  // PRIVATE METHODS ================================================
  /** Init the library opening hours/day attribute */
  private _initOpeningHours() {
    const days = Object.keys(WeekDays);
    for (let step = 0; step < 7; step++) {
      this.opening_hours.push({
        day: days[step],
        is_open: false,
        times: []
      });
    }
  }

  /** clean the opening hours/day attribute */
  private _cleanOpeningHours() {
    this.opening_hours.forEach(opening => {
      const times = [];
      opening.times.map(time => {
        if(time.start_time !== '00:00' && time.end_time !== '00:00') {
          times.push(time);
        }
      });
      opening.is_open = times.length !== 0;
      opening.times = times;
    });
  }

  /** reorder the opening hour/day attribute */
  private _reorderOpeningHours() {
    this.opening_hours.forEach(opening => {
      if (opening.times.length > 1) {
        opening.times.sort((a, b) =>
          DateTime.fromFormat(a.start_time, 'HH:mm').diff(DateTime.fromFormat(b.start_time, 'HH:mm')));
      }
    });
  }

  /**
   * Increment a repeatable exception date by interval defined into `repeat` metadata.
   * @param exception - the exception to increment.
   * @returns ExceptionDates the incremented exception date.
   */
  private static _incrementExceptionDate(exception: ExceptionDates): ExceptionDates {
    // only repeatable exception date could be increment
    if (!exception.repeat) {
      throw new Error('Unable to increment not repeatable exception date.');
    }
    const jsUnitMapper = {daily: 'days', weekly: 'weeks', monthly: 'months', yearly: 'years'};
    const unity = (jsUnitMapper.hasOwnProperty(exception.repeat.period))
      ? jsUnitMapper[exception.repeat.period]
      : 'days';
    if (typeof exception.start_date === 'string') {
      exception.start_date = DateTime.fromFormat(exception.start_date, 'yyyy-LL-dd');
    }
    exception.start_date = exception.start_date.plus({ [unity]: exception.repeat.interval }).toISODate();

    if (exception.end_date) {
        if (typeof exception.end_date === 'string') {
          exception.end_date = DateTime.fromFormat(exception.end_date, 'yyyy-LL-dd');
        }
        exception.end_date = exception.end_date.plus({ [unity]: exception.repeat.interval }).toISODate();
      }
    return exception;
  }

  /**
   * Clean acquisition setting.
   *
   * For each acquisition information, we need to have a special process to clean the address field because
   * `country` field are used with a select into the related ReactForm. As we use a select, we can't clear
   * the value ; so if address.country is the only field present for an address, we can remove this field
   * from record.
   */
  private _cleanAcquisitionSettings() {
    if (this.acquisition_settings) {
      Object.keys(this.acquisition_settings).forEach((key) => {
        const data = this.acquisition_settings[key];
        if (Object.keys(data).length == 1 && data.address && Object.keys(data.address).length == 1 && data.address.country) {
          delete this.acquisition_settings[key];
        }
      });
      if (Object.keys(this.acquisition_settings).length === 0) {
        delete this.acquisition_settings;
      }
    }
    if (this.serial_acquisition_settings) {
      Object.keys(this.serial_acquisition_settings).forEach((key) => {
        const data = this.serial_acquisition_settings[key];
        if (Object.keys(data).length == 1 && data.address && Object.keys(data.address).length == 1 && data.address.country) {
          delete this.serial_acquisition_settings[key];
        }
      });
      if (Object.keys(this.serial_acquisition_settings).length === 0) {
        delete this.serial_acquisition_settings;
      }
    }
  }

  /**
   * Convert a string day name to the corresponding day of the week constant.
   * @param dayName - the name of the day
   * @returns A WeekDay enum value (0=Sunday, 6=Saturday) or null if conversion failed.
   */
  private static convertDayToWeekDay(dayName: string): WeekDay | null {
    const daysOfWeek = {
      'sunday': WeekDay.Sunday,
      'monday': WeekDay.Monday,
      'tuesday': WeekDay.Tuesday,
      'wednesday': WeekDay.Wednesday,
      'thursday': WeekDay.Thursday,
      'friday': WeekDay.Friday,
      'saturday': WeekDay.Saturday,
    };
    return dayName.toLowerCase() in daysOfWeek
      ? daysOfWeek[dayName.toLowerCase()]
      : null;
  }
}
