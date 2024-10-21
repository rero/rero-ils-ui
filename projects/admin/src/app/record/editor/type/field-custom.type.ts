/*
 * RERO ILS UI
 * Copyright (C) 2019-2024 RERO
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
import { Component, OnInit } from '@angular/core';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';

@Component({
  selector: 'admin-field-custom-input',
  template: `
    <div class="form-group m-0 d-flex align-items-start">
      <!-- label -->
      @if (props.label && props.hideLabel !== true) {
        <label [attr.for]="id" class="mr-2 col-form-label" [pTooltip]="props.description" tooltipPosition="top">
          {{ props.label }}
          @if (props.required && props.hideRequiredMarker !== true) {
            &nbsp;*
          }
        </label>
      }
      <!-- field -->
      <div class="flex-grow-1">
        @switch (field.type) {
          @case ('input') {
            <formly-field [field]="field"></formly-field>
          }
          @case ('select') {
            <formly-field [field]="field"></formly-field>
          }
        }
      </div>
    </div>
  `,
})
export class FieldCustomInputTypeComponent extends FieldType<FieldTypeConfig> implements OnInit {

  /** OnInit hook */
  ngOnInit(): void {
    // We delete the class, as it is already set to the top level by the config.
    if (Object.keys(this.field).includes('className')) {
      delete this.field.className;
    }
  }
}
