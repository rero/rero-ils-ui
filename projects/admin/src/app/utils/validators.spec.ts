/*
 * RERO ILS UI
 * Copyright (C) 2025 RERO
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

import { FormControl } from "@angular/forms";
import { DateValidators } from "./validators";

describe('DateValidators', () => {

  it('should validate the minimum date', () => {
    const minDate = new Date('2025-01-01');
    const validator = DateValidators.minimumDateValidator(minDate, DateValidators.DATE_FORMAT);
    const control = new FormControl();

    control.setValue(null);
    expect(validator(control)).toBeNull();

    control.setValue(new Date('2024-10-10'));
    expect(validator(control)).toEqual({
      'minimum-date': {
        'date-minimum': '2025-01-01',
        actual: '2024-10-10'
      }
    });

    control.setValue(new Date('2025-04-24'));
    expect(validator(control)).toBeNull();
  });
});
