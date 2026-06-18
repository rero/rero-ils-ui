// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

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
