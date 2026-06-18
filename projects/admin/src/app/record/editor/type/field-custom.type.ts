// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Component, OnInit, ChangeDetectionStrategy} from '@angular/core';
import { FieldType, FieldTypeConfig, FormlyModule } from '@ngx-formly/core';

@Component({
    selector: 'admin-field-custom-input',
    template: `
      <!-- field -->
      <div>
        @switch (field.type) {
          @case ('input') {
            <formly-field [field]="field" />
          }
          @case ('select') {
            <formly-field [field]="field" />
          }
        }
      </div>
  `,
    imports: [FormlyModule],
  changeDetection: ChangeDetectionStrategy.OnPush
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
