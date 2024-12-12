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
import { Component } from '@angular/core';
import { FieldArrayType } from '@ngx-formly/core';

@Component({
  selector: 'admin-repeat-section',
  template: `
    @for (field of field.fieldGroup; track field; let i = $index) {
      <div class="grid">
        <div class="col-11">
          <formly-field [field]="field"></formly-field>
        </div>
        <div class="col-1 flex gap-1">
          @if (field.parent.fieldGroup.length > props.minItems) {
            <p-button
              (onClick)="remove(i)"
              severity="danger"
              icon="fa fa-trash"
              [rounded]="true"
              [text]="true"
            />
          }
          @if (field.parent.props.maxItems > field.parent.fieldGroup.length && field.parent.fieldGroup.length -1 === i) {
            <p-button
              (onClick)="add()"
              icon="fa fa-plus-circle"
              [rounded]="true"
              [text]="true"
            />
          }
        </div>
      </div>
    }
  `,
})
export class RepeatTypeComponent extends FieldArrayType { }
