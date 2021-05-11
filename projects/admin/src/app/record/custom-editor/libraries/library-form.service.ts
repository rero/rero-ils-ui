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
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RecordService, TimeValidator } from '@rero/ng-core';
import { Subject } from 'rxjs';
import { Library, NotificationSettings, NotificationType } from '../../../classes/library';
import { WeekDays } from '../../../classes/week-days';



@Injectable({
   providedIn: 'root'
})
export class LibraryFormService {

  /** Angular form group */
  public form;


  /** RERO ILS notification types */
  private notificationTypes = [];

  /** Observable for build event */
  private buildEvent = new Subject();

  /** RERO ILS communication languages */
  private availableCommunicationLanguages = [];

  /**
   * Constructor
   *
   * @param _fb - FormBuilder
   * @param _recordService - RecordService
   */
  constructor(
    private _fb: FormBuilder,
    private _recordService: RecordService
    ) { }

  /**
   * Build form
   */
  build(): void {
    this.form = this._fb.group({
      name: ['', [
        Validators.required,
        Validators.minLength(4)
      ]],
      address: ['', Validators.minLength(4)],
      email: ['', Validators.email],
      code: ['', {
        validators: [
          Validators.required
        ]
      }],
      opening_hours: this._fb.array([]),
      notification_settings: this._fb.array([]),
      communication_language: ['', Validators.required]
    });
    this.initializeOpeningHours();
    this.initializeNotificationSettings();
  }

  /**
   * Get build event
   */
  getBuildEvent() {
    return this.buildEvent.asObservable();
  }

  create() {
    this._recordService
      .getSchemaForm('notifications')
      .subscribe((jsonSchema: any) => {
        this.notificationTypes = jsonSchema.schema.properties.notification_type.enum;
        this.build();
        this.buildEvent.next(true);
      });
    this._recordService
      .getSchemaForm('libraries')
      .subscribe((jsonSchema: any) => {
        this.availableCommunicationLanguages = jsonSchema.schema.properties.communication_language.enum;
      });
  }

  /**
   * Build and set default values for opening hours at form initialization
   * @param openingHours - opening hours
   */
  initializeOpeningHours(openingHours = []) {
    const days = Object.keys(WeekDays);
    const hours = this.form.get('opening_hours');
    for (let step = 0; step < 7; step++) {
      hours.push(this.buildOpeningHours(
        false,
        days[step],
        this._fb.array([])
      ));
    }
    this.setOpeningHours(openingHours);
  }

  /**
   * Set opening hours from record data
   * @param openingHours - opening hours
   */
  setOpeningHours(openingHours = []) {
    for (let step = 0; step < 7; step++) {
      const atimes = this.getTimesByDayIndex(step);
      const day = openingHours[step];
      if (day !== undefined) {
        if (day.times.length > 0) {
          atimes.removeAt(0);
          const hours = this.form.get('opening_hours').get(String(step));
          hours.get('is_open').setValue(day.is_open);
          day.times.forEach(time => {
            atimes.push(this.buildTimes(time.start_time, time.end_time));
          });
        }
      } else {
        atimes.push(this.buildTimes('08:00', '18:00'));
      }
    }
  }

  /**
   * Create opening hour form control
   * @param isOpen - is open
   * @param day - day
   * @param times - times array
   */
  buildOpeningHours(isOpen, day, times): FormGroup {
    return this._fb.group({
      is_open: [isOpen],
      day: [day],
      times
    }, {
      validator: [TimeValidator.RangePeriodValidator()]
    });
  }

  /**
   * Create times form control
   * @param startTime - start time
   * @param endTime - end time
   */
  buildTimes(startTime = '00:01', endTime = '23:59'): FormGroup {
    const regex = '^(?!(0:00)|(00:00)$)([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$';
    return this._fb.group({
      start_time: [startTime, {
        validators: [
          Validators.required,
          Validators.pattern(regex)
        ]
      }],
      end_time: [endTime, {
        validators: [
          Validators.required,
          Validators.pattern(regex)
        ]
      }]
    }, {
      validator: TimeValidator.greaterThanValidator('start_time', 'end_time')
    });
  }

  /**
   * Populate the form
   * @param library - library
   */
  populate(library: Library) {
    this.form.patchValue({
      name: library.name,
      address:  library.address,
      email: library.email,
      code: library.code,
      communication_language: library.communication_language
    });
    this.setOpeningHours(library.opening_hours);
    this.setNotificationSettings(library.notification_settings);
  }

  /**
   * Build an set default values for notification settings
   * @param notificationSettings  - notification settings
   */
  initializeNotificationSettings(notificationSettings = []) {
    const settings = this.form.get('notification_settings');
    this.notificationTypes.forEach(type => {
      settings.push(this.getSettingsByType(type));
    });
    this.setNotificationSettings(notificationSettings);
  }

  /**
   * Get setting by type
   * @param settingType - setting type
   */
  getSettingsByType(settingType: NotificationType) {
    const model: NotificationSettings = {
      type: settingType,
      email: ''
    };
    switch (settingType) {
      case(NotificationType.AVAILABILITY):
        model.delay = 0;
        break;
    }
    return this._fb.group(model);
  }

  /**
   * Set values from record
   * @param notificationSettings - notification settings
   */
  setNotificationSettings(notificationSettings = []) {
    if (notificationSettings.length > 0) {
      const formSettings = this.form.get('notification_settings');
      for (let step = 0; step < formSettings.value.length; step++) {
        const formSetting = formSettings.get(String(step));
        const currentSetting = notificationSettings.find(element => element.type === formSetting.get('type').value);
        if (currentSetting !== undefined) {
          formSetting.get('email').setValue(currentSetting.email);
          if (currentSetting.delay !== undefined) {
            formSetting.get('delay').setValue(currentSetting.delay);
          }
        }
      }
    }
  }

  setId(id) { this.form.value.id = id; }
  setLibraryPid(pid) { this.form.value.pid = pid; }
  setSchema(schema) { this.form.value.$schema = schema; }

  get name(): AbstractControl { return this.form.get('name'); }
  get address(): AbstractControl { return this.form.get('address'); }
  get email(): AbstractControl { return this.form.get('email'); }
  get code(): AbstractControl { return this.form.get('code'); }
  get opening_hours(): FormArray {
    return this.form.get('opening_hours') as FormArray;
  }
  get notification_settings(): FormArray {
    return this.form.get('notification_settings') as FormArray;
  }
  get communication_language(): AbstractControl {
    return this.form.get('communication_language');
  }

  get available_communication_languages() {
    return this.availableCommunicationLanguages;
  }

  getValues(): any { return this.form.value; }

  addTime(dayIndex): void {
    this.getTimesByDayIndex(dayIndex).push(this.buildTimes());
  }

  deleteTime(dayIndex, timeIndex): void {
    this.getTimesByDayIndex(dayIndex).removeAt(timeIndex);
  }

  getTimesByDayIndex(dayIndex): FormArray {
    return this.form.get('opening_hours')
      .get(String(dayIndex))
      .get('times') as FormArray;
  }
}
