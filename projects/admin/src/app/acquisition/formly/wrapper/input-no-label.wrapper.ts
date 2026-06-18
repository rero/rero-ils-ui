// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Component, ChangeDetectionStrategy} from '@angular/core';
import { FieldWrapper, FormlyModule } from '@ngx-formly/core';

@Component({
    selector: 'admin-formly-input-no-label-wrapper',
    template: `
  <div class="ui:my-2">
    <ng-container #fieldComponent></ng-container>
    @if (showError) {
      <div class="text-error ui:my-2">
        <formly-validation-message [field]="field" />
      </div>
    }
  </div>
  `,
    imports: [FormlyModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputNoLabelWrapperComponent extends FieldWrapper {}
