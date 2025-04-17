/*
 * RERO ILS UI
 * Copyright (C) 2020-2025 RERO
 * Copyright (C) 2020 UCLouvain
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
