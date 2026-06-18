// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later

import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { DateTime } from 'luxon';

/** Custom date validators */
export class DateValidators {

  /** Date format to check */
  static DATE_FORMAT = 'yyyy-LL-dd';

  /**
   * Allow to check if a date is valid and older than a specified date
   * @param minDate: the minimum date. The field date should be equal or older.
   * @param dateFormat: the format of the input date
   */
  static minimumDateValidator(minDate: Date, dateFormat: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value == null) {
        return null;
      }

      const date = DateTime.fromJSDate(control.value);
      if (!date.isValid) {
        return null;
      }
      const validationDate = minDate.setHours(0, 0, 0, 0);
      date.set({ hours: 0, minutes: 0, seconds: 0, milliseconds: 0});
      return date >= validationDate
        ? null
        : {
          'minimum-date': {
            'date-minimum': DateTime.fromJSDate(minDate).toFormat(dateFormat),
            actual: date.toFormat(dateFormat)
          }
        };
    };
  }
}
