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
  selector: 'admin-formly-repeat-section',
  template: `
    <p-panel styleClass="mb-2">
      <ng-template pTemplate="header">
        @if (field.props.label || field.props.addButton) {
            <label class="flex align-items-center" [ngClass]="field.props.className">
              @if (field.props.label) {
                <span>{{ field.props.label|translate }}</span>
              }
              @if (field.props.addButton) {
                <p-button
                  text
                  (onClick)="add()"
                  icon="fa fa-clone"
                />
              }
              @if (field.props.selectUnselect) {
                  <p-button
                    text
                    (onClick)="field.props.selectUnselect($event, 'select', field.fieldGroup)"
                    [label]="'Select all' | translate"
                  />
                  <p-button
                    text
                    (onClick)="field.props.selectUnselect($event, 'unselect', field.fieldGroup)"
                    translate
                    [label]="'Deselect all' | translate"
                    />
              }
            </label>
        }
      </ng-template>
      @if (field.fieldGroup.length > 0) {
          <div class="grid grid-nogutter">
            <div [ngClass]="field.props.trashButton ? 'col-11 col-offset-1': 'col-12'">
              <div class="grid mt-2">
                @for (field of field.fieldGroup[0].fieldGroup; track field) {
                  @if (field.className) {
                    <div class="{{ field.props.headerClassName }}">
                      {{ field.props.label|translate }}
                      @if (field.props.required) {
                        &nbsp;*
                      }
                    </div>
                  }
                }
              </div>
            </div>
            @for (f of field.fieldGroup; track f; let i = $index) {
              @if (f.fieldGroup.length > 0) {
                <formly-field [ngClass]="field.props.trashButton ? 'col-11': 'col-12'" [field]="f" />
                @if (field.props.trashButton) {
                  <div class="col-1 flex align-items-center justify-content-end">
                    @if (showTrash) {
                      <p-button
                        size="small"
                        severity="secondary"
                        (onClick)="remove(i)"
                        icon="fa fa-trash"
                      />
                    } @else {
                      &nbsp;
                    }
                  </div>
                }
              }
            }
        </div>
      }
    </p-panel>
  `
})
export class RepeatTypeComponent extends FieldArrayType {

  /**
   * Show trash on right line
   * @returns boolean
   */
  get showTrash() {
    return this.field.fieldGroup.length > (this.props.minLength || 0);
  }
}
