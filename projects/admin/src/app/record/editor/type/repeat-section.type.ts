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
      <div class="row">
        <div class="col-11">
          <formly-field [field]="field"></formly-field>
        </div>
        <div class="col-1 my-0 pt-2 pl-0 d-flex">
          @if (field.parent.fieldGroup.length > props.minItems) {
            <i (click)="remove(i)" class="mt-3 pl-3 fa fa-lg fa-trash text-danger" aria-hidden="true"></i>
          }
          @if (field.parent.props.maxItems > field.parent.fieldGroup.length && field.parent.fieldGroup.length -1 === i) {
            <i (click)="add()" class="mt-3 pl-3 fa fa-lg fa-plus-circle text-primary" aria-hidden="true"></i>
          }
        </div>
      </div>
    }
  `,
})
export class RepeatTypeComponent extends FieldArrayType { }
