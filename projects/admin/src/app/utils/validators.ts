/*
 * RERO ILS UI
 * Copyright (C) 2020 RERO
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
import moment from 'moment';

/** Custom date validators */
export class DateValidators {

  /** Date format to check */
  static FORMAT_DATE = 'YYYY-MM-DD';

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
      const controlDate = moment(control.value, DateValidators.FORMAT_DATE);
      if (!controlDate.isValid()) {
        return null;
      }
      const validationDate = moment(minDate, DateValidators.FORMAT_DATE);
      return controlDate.isAfter(validationDate) ? null : {
        'minimum-date': {
          'date-minimum': validationDate.format(DateValidators.FORMAT_DATE),
          actual: controlDate.format(DateValidators.FORMAT_DATE)
        }
      };
    };
  }
}
