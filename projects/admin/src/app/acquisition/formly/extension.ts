/*
 * RERO ILS UI
 * Copyright (C) 2021 RERO
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
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TranslateService } from '@ngx-translate/core';

/**
 * Receipt Quantity Max Validator
 * @param control - AbstractControl
 * @returns object or null
 */
export function receiptQuantityMaxValidator(control: AbstractControl): ValidationErrors {
  const fields = control.value;
  if (fields.quantityMax >= fields.quantity) {
    return null;
  }
  return { receiptQuantityMax: {} };
}

/**
 * Register Formly Extension
 * @param translate - TranslateService
 * @returns Object
 */
export function registerFormlyExtension(translate: TranslateService) {
  return {
    validators: [
      { name: 'receiveQuantityMax', validation: receiptQuantityMaxValidator }
    ],
    validationMessages: [
      {
        name: 'receiptQuantityMax',
        message: (err, field: FormlyFieldConfig) =>
          translate.stream(
            _('Max. quantity: {{ max }}'),
            { max: field.parent.formControl.value.quantityMax }
          )
      }
    ]
  };
}
