/*
 * RERO ILS UI
 * Copyright (C) 2021-2024 RERO
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
    selector: 'admin-formly-receipt-lines',
    template: `
    <p-panel [header]="'Add receipt line(s)' | translate" styleClass="ui:my-3">
      @if (field.fieldGroup.length > 0) {
        <div class="ui:grid ui:grid-cols-12 ui:gap-4  ui:px-4">
          @for (f of field.fieldGroup[0].fieldGroup; track f.id) {
            @if(f.props.className !== 'ui:hidden') {
              <div class="{{ f.props.headerClassName }}">
                @if(f.props.checkbox && field.props.selectUnselect) {
                  <p-checkbox (onChange)="field.props.selectUnselect($event.checked? 'select': 'unselect', field.fieldGroup)" [binary]="true" />
                }
                @else {
                    {{ f.props.label|translate }}
                    @if (f.props.required) {
                      &nbsp;*
                    }
                }
              </div>
            }
          }
          <div class="ui:col-span-12">
            @for (f of field.fieldGroup; track f.id; let i = $index) {
              @if (f.fieldGroup.length > 0) {
                <formly-field [field]="f" />
              }
            }
          </div>
        </div>
      }
    </p-panel>
  `,
    standalone: false
})
export class ReceiptLinesTypeComponent extends FieldArrayType {}
