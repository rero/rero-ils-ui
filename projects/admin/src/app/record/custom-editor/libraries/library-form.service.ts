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
import { AbstractControl, UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { RecordService, TimeValidator } from '@rero/ng-core';
import { forkJoin, Subject } from 'rxjs';
import { AcquisitionInformations, Library, NotificationSettings } from '../../../classes/library';
import { NotificationType } from '../../../classes/notification';
import { WeekDays } from '../../../classes/week-days';

@Injectable({
   providedIn: 'root'
})
export class LibraryFormService {

  // SERVICE ATTRIBUTES =======================================================
  /** Angular form group */
  public form;

  /** RERO-ILS notification types */
  private notificationTypes = [];
  /** RERO-ILS communication languages */
  private availableCommunicationLanguages = [];
  /** RERO-ILS countries */
  private countryList = [];
  /** Observable for build event */
  private buildEvent = new Subject();

  // GETTER & SETTER ==========================================================
  get name(): AbstractControl { return this.form.get('name'); }
  get address(): AbstractControl { return this.form.get('address'); }
  get email(): AbstractControl { return this.form.get('email'); }
  get code(): AbstractControl { return this.form.get('code'); }
  get opening_hours(): UntypedFormArray { return this.form.get('opening_hours') as UntypedFormArray; }
  get notification_settings(): UntypedFormArray { return this.form.get('notification_settings') as UntypedFormArray; }
  get communication_language(): AbstractControl { return this.form.get('communication_language'); }
  get available_communication_languages() { return this.availableCommunicationLanguages; }
  get countries_iso_codes() { return this.countryList; }

  // SERVICE CONSTRUCTOR & HOOKS ==============================================
  /** Constructor
   * @param _fb - FormBuilder
   * @param _recordService - RecordService
   */
  constructor(
    private _fb: UntypedFormBuilder,
    private _recordService: RecordService
  ) { }

  // SERVICE FUNCTIONS ========================================================
  /** Build the form structure */
  build(): void {
    this.form = this._fb.group({
      name: ['', [Validators.required, Validators.minLength(4)]],
      address: ['', Validators.minLength(4)],
      email: ['', Validators.email],
      code: ['', [Validators.required]],
      communication_language: ['', Validators.required],

      opening_hours: this._fb.array([]),
      notification_settings: this._fb.array([]),
      acquisition_settings: this._fb.group({
        shipping_informations: this._buildAcqInformation(),
        billing_informations: this._buildAcqInformation()
      })
    });
    this._initializeOpeningHours();
    this._initializeNotificationSettings();
  }

  /** Get build event */
  getBuildEvent() {
    return this.buildEvent.asObservable();
  }

  /** Method to create the form and get default available values */
  create() {
    const notificationSchema$ = this._recordService.getSchemaForm('notifications');
    const librarySchema$ = this._recordService.getSchemaForm('libraries');
    forkJoin([librarySchema$, notificationSchema$]).subscribe(([libSchema, notifSchema]) => {
      this.availableCommunicationLanguages = libSchema.schema.properties.communication_language.enum;
      this.notificationTypes = notifSchema.schema.properties.notification_type.enum;
      this.countryList = libSchema.schema.properties.acquisition_settings.properties.shipping_informations.
        properties.address.properties.country.enum;
      this.build();
      this.buildEvent.next(true);
    });
  }

  /**
   * Populate the form
   * @param library - The library metadata
   */
  populate(library: Library) {
    this.form.patchValue({
      name: library.name,
      address:  library.address,
      email: library.email,
      code: library.code,
      communication_language: library.communication_language
    });
    this._setOpeningHours(library.opening_hours);
    this._setNotificationSettings(library.notification_settings);
    this._setAcquisitionSettings(library.acquisition_settings);
  }

  /** Get the values stored in the form */
  getValues(): any {
    return this.form.value;
  }


  /**
   * Allow to add a time period interval into the form for a specific day
   * @param dayIndex - the day index (0 for monday, 6 for sunday)
   */
  addTime(dayIndex: number): void {
    this._getTimesByDayIndex(dayIndex).push(this._buildTimes());
  }

  /**
   * Allow to delete a time period interval into the form for a specific day
   * @param dayIndex - the day index (0 for monday, 6 for sunday)
   * @param timeIndex - the period time index
   */
  deleteTime(dayIndex: number, timeIndex: number): void {
    this._getTimesByDayIndex(dayIndex).removeAt(timeIndex);
  }

  // SERVICE PRIVATE FUNCTIONS ================================================
  /**
   * Build and set default values for opening hours at form initialization
   * @param openingHours - opening hours
   */
  private _initializeOpeningHours(openingHours = []) {
    const days = Object.keys(WeekDays);
    const hours = this.form.get('opening_hours');
    for (let step = 0; step < 7; step++) {
      hours.push(this._buildOpeningHours(false, days[step], this._fb.array([])));
    }
    this._setOpeningHours(openingHours);
  }

  /**
   * Set opening hours from record data
   * @param openingHours - opening hours
   */
  private _setOpeningHours(openingHours = []) {
    for (let step = 0; step < 7; step++) {
      const atimes = this._getTimesByDayIndex(step);
      const day = openingHours[step];
      if (day !== undefined) {
        if (day.times.length > 0) {
          atimes.removeAt(0);
          const hours = this.form.get('opening_hours').get(String(step));
          hours.get('is_open').setValue(day.is_open);
          day.times.forEach(time => atimes.push(this._buildTimes(time.start_time, time.end_time)));
        }
      } else {
        atimes.push(this._buildTimes('08:00', '18:00'));
      }
    }
  }

  /**
   * Create opening hour form control
   * @param isOpen - is open
   * @param day - day
   * @param times - times array
   */
  private _buildOpeningHours(isOpen: boolean, day, times): UntypedFormGroup {
    return this._fb.group({
      is_open: [isOpen],
      day: [day],
      times
    }, {
      validators: [TimeValidator.RangePeriodValidator()]
    });
  }

  /**
   * Create times form control
   * @param startTime - start time
   * @param endTime - end time
   */
  private _buildTimes(startTime = '00:01', endTime = '23:59'): UntypedFormGroup {
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
      validators: TimeValidator.greaterThanValidator('start_time', 'end_time')
    });
  }

  /**
   * Get times period for a specific day
   * @param dayIndex - the day index
   * @return: The corresponding FormArray (at least an empty array)
   */
  private _getTimesByDayIndex(dayIndex): UntypedFormArray {
    return this.form.get('opening_hours')
      .get(String(dayIndex))
      .get('times') as UntypedFormArray;
  }

  /** Build structure to store acquisition information into the form */
  private _buildAcqInformation(): UntypedFormGroup {
    return this._fb.group({
      name: ['', Validators.minLength(3)],
      email: ['', Validators.email],
      phone: ['', Validators.minLength(6)],
      address: this._fb.group({
        street: ['', Validators.minLength(3)],
        zip_code: ['', Validators.minLength(3)],
        city: ['', Validators.minLength(2)],
        country: ['', Validators.minLength(2)],
      }),
      extra: ['', Validators.minLength(3)]
    });
  }

  /**
   * Set acquisition informations from record
   * @param acquisitionSettings: the acquisition settings from record.
   */
  private _setAcquisitionSettings(acquisitionSettings: AcquisitionInformations | null): void {
    if (acquisitionSettings != null) {
      const fieldNames = ['shipping_informations', 'billing_informations'];
      fieldNames.forEach((fieldName) => {
        if (acquisitionSettings.hasOwnProperty(fieldName)) {
          this._setAcquisitionInformation(fieldName, acquisitionSettings[fieldName]);
        }
      });
    }
  }

  /**
   * Populate form with acquisition informations from record.
   * @param key: the section of acquisition to fill in.
   * @param data: the acquisition informations values from record related to the key.
   */
  private _setAcquisitionInformation(key, data): void {
    const formField = this.form.get('acquisition_settings').get(key);
    formField.get('name').setValue(data.name);
    formField.get('email').setValue(data.email);
    formField.get('phone').setValue(data.phone);
    formField.get('extra').setValue(data.extra);
    if (data.address) {
      formField.get('address').get('street').setValue(data.address.street);
      formField.get('address').get('zip_code').setValue(data.address.zip_code);
      formField.get('address').get('city').setValue(data.address.city);
      formField.get('address').get('country').setValue(data.address.country);
    }
  }

  /**
   * Build an set default values for notification settings
   * @param notificationSettings  - notification settings
   */
  private _initializeNotificationSettings(notificationSettings = []) {
    const settings = this.form.get('notification_settings');
    this.notificationTypes.forEach(type => settings.push(this._buildSettingsByType(type)));
    this._setNotificationSettings(notificationSettings);
  }

  /**
   * Build the notification setting for a specific type
   * @param settingType - the notification type
   */
  private _buildSettingsByType(settingType: NotificationType): UntypedFormGroup {
    const model: NotificationSettings = {
      type: settingType,
      email: ''
    };
    if ([NotificationType.AVAILABILITY].includes(settingType)) {
      model.delay = 0;
    }
    return this._fb.group(model);
  }

  /**
   * Set values from record
   * @param notificationSettings - notification settings
   */
  private _setNotificationSettings(notificationSettings = []) {
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
}
