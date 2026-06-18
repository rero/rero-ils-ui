// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Component, ChangeDetectionStrategy} from '@angular/core';
import { FieldArrayType, FormlyModule } from '@ngx-formly/core';
import { TranslatePipe } from '@ngx-translate/core';
import { PanelModule } from 'primeng/panel';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
    selector: 'admin-formly-receipt-lines',
    template: `
    <p-panel [header]="'Add receipt line(s)' | translate" class="ui:my-3">
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
    imports: [FormlyModule, TranslatePipe, PanelModule, CheckboxModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReceiptLinesTypeComponent extends FieldArrayType {}
