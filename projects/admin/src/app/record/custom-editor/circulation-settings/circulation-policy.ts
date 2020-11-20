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
export interface Organisation {
  $ref: string;
}

export class CirculationPolicy {
  $schema: string = null;
  id: string = null;
  pid: string = null;
  name: string = null;
  description: string = null;
  organisation: Organisation;
  allow_requests: boolean = null;
  allow_checkout: boolean = null;
  checkout_duration: number = null;
  number_of_days_after_due_date: number = null;
  number_of_days_before_due_date: number = null;
  number_renewals: number = null;
  renewal_duration: number = null;
  reminder_fee_amount: number = null;
  policy_library_level: boolean = null;
  is_default: boolean = null;
  libraries: Array<any> = [];
  settings: Array<any> = [];

  constructor(obj?: any) {
    if (obj) {
      this.update(obj);
    } else {
      this.setDefault();
    }
  }

  setDefault() {
    this.allow_requests = this.getDefaultAllowRequests();
    this.allow_checkout = this.getDefaultAllowCheckout();
    this.checkout_duration = this.getDefaultCheckoutDuration();
    this.number_of_days_after_due_date = this.getDefaultNumberOfDaysAfterDueDate();
    this.number_of_days_before_due_date = this.getNumberOfDaysBeforeDueDate();
    this.number_renewals = this.getDefaultNumberOfRenewals();
    this.reminder_fee_amount = this.getDefaultReminderFeeAmount();
    this.policy_library_level = false;
    this.is_default = false;
    this.organisation = {
      $ref: null
    };
    this.libraries = [];
    this.settings = [];
  }

  update(obj: any) {
    Object.assign(this, obj);
  }

  public getDefaultAllowRequests() {
    return true;
  }

  public getDefaultAllowCheckout() {
    return true;
  }

  public getDefaultCheckoutDuration() {
    return 7;
  }

  public getDefaultNumberOfDaysAfterDueDate(){
    return 5;
  }

  public getNumberOfDaysBeforeDueDate() {
    return 5;
  }

  public getDefaultNumberOfRenewals() {
    return 0;
  }

  public getDefaultReminderFeeAmount() {
    return 2;
  }
}
