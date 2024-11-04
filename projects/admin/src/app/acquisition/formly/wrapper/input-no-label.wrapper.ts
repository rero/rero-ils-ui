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
import { FieldWrapper } from '@ngx-formly/core';

@Component({
selector: 'admin-formly-input-no-label-wrapper',
template: `
  <div class="my-2">
    <ng-container #fieldComponent></ng-container>
    @if (showError) {
      <div class="text-error my-2">
        <formly-validation-message [field]="field" />
      </div>
    }
  </div>
  `
})
export class InputNoLabelWrapperComponent extends FieldWrapper {}
