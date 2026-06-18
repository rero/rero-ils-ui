// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { _ } from "@ngx-translate/core";
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
