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
import { FormBuilder, Validators } from '@angular/forms';
import { CirculationPolicy } from './circulation-policy';
import { ApiService } from '@rero/ng-core';

@Injectable({
  providedIn: 'root'
})
export class CirculationPolicyFormService {

  /**
   * Current form
   */
  private _form: any;

  /**
   * Constructor
   * @param _apiService - ApiService
   * @param _fb - FormBuilder
   */
  constructor(
    private _apiService: ApiService,
    private _fb: FormBuilder
  ) {
    this._build();
    this._observeFormControls();
  }

  /** Poulate the form
   * @param circulation - circulation policy used to populate the form
   */
  public populate(circulation: CirculationPolicy) {
    this._form.patchValue({
      name: circulation.name,
      description: circulation.description,
      allow_checkout: circulation.allow_checkout,
      checkout_duration: circulation.checkout_duration,
      number_of_days_after_due_date: circulation.number_of_days_after_due_date,
      number_of_days_before_due_date: circulation.number_of_days_before_due_date,
      allow_requests: circulation.allow_requests,
      allow_renewals: !(circulation.number_renewals === null),
      number_renewals: circulation.number_renewals,
      renewal_duration: circulation.renewal_duration,
      loan_expiry_notice: !(circulation.number_of_days_before_due_date === null),
      send_first_reminder: !(circulation.number_of_days_after_due_date === null),
      reminder_fee_amount: circulation.reminder_fee_amount,
      policy_library_level: circulation.policy_library_level,
      is_default: circulation.is_default,
      settings: this._unserializeSettings(circulation.settings)
    });
    if ('libraries' in circulation) {
      this._form.get('libraries').setValue(
        this._unserializeLibraries(circulation.libraries)
      );
    }
  }

  /**
   * Get form
   */
  public getForm() {
    return this._form;
  }

  /**
   * Build form
   */
  private _build() {
    this._form = this._fb.group({
      name: [null, [
        Validators.required,
        Validators.minLength(2)
      ]],
      description: [],
      allow_requests: [true],
      allow_checkout: [true],
      checkout_duration: [7, [
        Validators.required,
        Validators.min(0),
        Validators.pattern(/^[0-9]+([0-9]*)?$/)
      ]],
      number_of_days_after_due_date: [5, [
        Validators.required,
        Validators.min(1),
        Validators.pattern(/^[1-9]+([0-9]*)?$/)
      ]],
      number_of_days_before_due_date: [5, [
        Validators.required,
        Validators.min(0),
        Validators.pattern(/^[0-9]+([0-9]*)?$/)
      ]],
      allow_renewals: [true],
      number_renewals: [0, [
        Validators.required,
        Validators.min(0),
        Validators.pattern(/^[0-9]+([0-9]*)?$/)
      ]],
      renewal_duration: [null, [
        Validators.required,
        Validators.min(1),
        Validators.pattern(/^[1-9]+([0-9]*)?$/)
      ]],
      reminder_fee_amount: [2, [
        Validators.required,
        Validators.min(0),
        Validators.pattern(/^[0-9]+(\.[0-9]{1,2})?$/)
      ]],
      loan_expiry_notice: [true],
      send_first_reminder: [true],
      policy_library_level: [false],
      is_default: [],
      libraries: [],
      settings: []
    });
  }

  /**
   * Observe control forms: hide or display them according to what is checked
   */
  private _observeFormControls() {
    const allowCheckoutFormControls = [
      this._form.get('checkout_duration'),
      this._form.get('number_renewals'),
      this._form.get('number_of_days_after_due_date'),
      this._form.get('number_of_days_before_due_date'),
      this._form.get('reminder_fee_amount')
    ];
    const allowRenewalsFormControls = [
      this._form.get('number_renewals'),
      this._form.get('renewal_duration')
    ];
    const sendFirstReminderFormControls = [
      this._form.get('number_of_days_after_due_date'),
      this._form.get('reminder_fee_amount')
    ];
    const loanExpiryNoticeFormControl = this._form.get('number_of_days_before_due_date');
    this._form.get('allow_checkout').valueChanges.subscribe((checkout: boolean) => {
      if (checkout) {
        allowCheckoutFormControls.forEach((formControl: any) => formControl.enable());
      } else {
        allowCheckoutFormControls.forEach((formControl: any) => formControl.disable());
      }
    });
    this._form.get('allow_renewals').valueChanges.subscribe((renewals: boolean) => {
      if (renewals) {
        allowRenewalsFormControls.forEach((formControl: any) => formControl.enable());
      } else {
        allowRenewalsFormControls.forEach((formControl: any) => formControl.disable());
      }
    });
    this._form.get('loan_expiry_notice').valueChanges.subscribe((notice: boolean) => {
      if (notice) {
        loanExpiryNoticeFormControl.enable();
      } else {
        loanExpiryNoticeFormControl.disable();
      }
    });
    this._form.get('send_first_reminder').valueChanges.subscribe((reminder: boolean) => {
      if (reminder) {
        sendFirstReminderFormControls.forEach((formControl: any) => formControl.enable());
      } else {
        sendFirstReminderFormControls.forEach((formControl: any) => formControl.disable());
      }
    });
  }

  getControlByFieldName(fieldName: string) {
    return this._form.get(fieldName);
  }

  getValues() {
    const formValues = this._form.value;
    // delete calculate field before returns values of form
    formValues.allow_renewals = null;
    formValues.loan_expiry_notice = null;
    formValues.send_first_reminder = null;
    formValues.libraries = this._serializeLibraries(formValues.libraries);
    formValues.settings = this._serializeSettings(formValues.settings);
    return formValues;
  }

  private _unserializeLibraries(libraries: any) {
    const ulibraries = [];
    const librariesRegex = new RegExp(
      this._apiService.getRefEndpoint('libraries', '(.+)$')
    );
    libraries.forEach((element: any) => {
      ulibraries.push(
        element.$ref.match(librariesRegex)[1]
      );
    });
    return ulibraries;
  }

  private _serializeLibraries(libraries: any) {
    const slibraries = [];
    libraries.forEach((element: any) => {
      slibraries.push({
        $ref: this._apiService.getRefEndpoint('libraries', element)
      });
    });
    return slibraries;
  }

  private _unserializeSettings(settings: any) {
    const itemTypeRegex = new RegExp(
      this._apiService.getRefEndpoint('item_types', '(.+)$')
    );
    const patronTypeRegex = new RegExp(
      this._apiService.getRefEndpoint('patron_types', '(.+)$')
    );
    const mapping = [];
    settings.forEach((element: any) => {
      const pkey = 'p' + element.patron_type.$ref.match(patronTypeRegex)[1];
      if (!(pkey in mapping)) {
        mapping[pkey] = [];
      }
      mapping[pkey].push('i' + element.item_type.$ref.match(itemTypeRegex)[1]);
    });
    return mapping;
  }

  private _serializeSettings(settings: any) {
    const mapping = [];
    Object.keys(settings).forEach(key => {
      settings[key].forEach((element: any) => {
        mapping.push({
          patron_type: {
            $ref: this._apiService.getRefEndpoint('patron_types', key.substr(1))
          },
          item_type: {
            $ref: this._apiService.getRefEndpoint('item_types', element.substr(1))
          }
        });
      });
    });
    return mapping;
  }
}
