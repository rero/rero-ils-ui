// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Component, ChangeDetectionStrategy} from '@angular/core';
import { FieldArrayType, FormlyModule } from '@ngx-formly/core';
import { Bind } from 'primeng/bind';
import { Button } from 'primeng/button';

@Component({
    selector: 'admin-repeat-section',
    template: `
    @for (field of field.fieldGroup; track $index; let i = $index) {
      <div class="ui:grid ui:grid-cols-12 ui:gap-4 ui:mt-2">
        <div class="ui:col-span-11">
          <formly-field [field]="field"></formly-field>
        </div>
        <div class="ui:col-span-1 ui:flex ui:gap-1">
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
    imports: [FormlyModule, Bind, Button],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RepeatTypeComponent extends FieldArrayType { }
