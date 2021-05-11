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

/* tslint:disable */
// required as json properties is not lowerCamelCase

import { WeekDay } from '@angular/common';
import * as moment from 'moment';
import { WeekDays } from './week-days';


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
  start_date: string;
  end_date?: string;
  times?: Array<Hours>;
  repeat?: Repeat;
}

export enum NotificationType {
  DUE_SOON = 'due_soon',
  RECALL = 'recall',
  OVERDUE = 'overdue',
  AVAILABILITY = 'availability'
}

export interface NotificationSettings {
  type: NotificationType;
  email: string;
  delay?: number;
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
  organisation: Organisation;

  // GETTER & SETTER ================================================
  /** Allow to get all opening days for the library */
  get openingDays(): Array<WeekDay> {
    return this.opening_hours
      .filter(day => day.is_open)
      .map(day => Library.convertDayToWeekDay(day.day))
      .filter(day => day !== null);
  }

  /** Allow to get all closed days for the library */
  get closedDays(): Array<WeekDay> {
    return this.opening_hours
      .filter(day => !day.is_open)
      .map(day => Library.convertDayToWeekDay(day.day))
      .filter(day => day !== null);
  }

  /** Get all closed days from exception dates */
  get exceptionClosedDates(): Array<Date> {
    let exceptionDates = [];
    this.exception_dates
      .filter(exception => !exception.is_open)  // Keep only closed exceptions
      .forEach(exception => {
        const dates = (exception.end_date)
          ? Library._getIntervalDates(moment(exception.start_date).toDate(), moment(exception.end_date).toDate())
          : [moment(exception.start_date).toDate()];
        exceptionDates = exceptionDates.concat(dates);
        // TODO :: manage the "repeatability" behavior
      });
    return exceptionDates;
  }

  // CONSTRUCTOR ===================================================
  /**
   * Constructor
   * @param obj: the metadata to use to create a Library object.
   */
  constructor(obj?: any) {
    this._initOpeningHours();
    if (obj) {
      this.update(obj);
    }
    if (!this.exception_dates) {
      this.exception_dates = [];
    }
  }

  /**
   * Update the library
   * @param obj: the metadata to use to create a Library object.
   */
  update(obj) {
    Object.assign(this, obj);
    this._cleanOpeningHours();
    this._reorderOpeningHours();
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
          moment(a.start_time, 'HH:mm').diff(moment(b.start_time, 'HH:mm')));
      }
    });
  }

  /**
   * Convert a string day name to the corresponding day of the week constant.
   * @param dayName: the name of the day
   * @return A WeekDay enum value (0=Sunday, 6=Saturday) or null if conversion failed.
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
    return daysOfWeek[dayName.toLowerCase()] || null;
  }


  /**
   * Get all "day" dates contains into a range of two dates
   * @param startDate: the lower interval value
   * @param endDate: the upper interval value
   * @return An array of date (one per day)
   */
  private static _getIntervalDates(startDate: Date, endDate: Date): Array<Date> {
    let dateArray = [];
    let currentDate = startDate;
    while (currentDate <= endDate){
      dateArray.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dateArray;
  }

}
