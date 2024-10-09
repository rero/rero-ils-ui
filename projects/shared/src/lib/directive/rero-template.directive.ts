/*
 * RERO ILS UI
 * Copyright (C) 2019-2024 RERO
 * Copyright (C) 2019-2023 UCLouvain
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

import { Directive, inject, Input, TemplateRef } from '@angular/core';

/** See: https://github.com/primefaces/primeng/blob/master/src/app/components/api/shared.ts */

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[rTemplate]',
})
export class ReroTemplateDirective {

  public template: TemplateRef<any> = inject(TemplateRef);

  /** the template type. */
  @Input() type: string | undefined;
  /** the template name. */
  @Input('rTemplate') name: string | undefined;

  /** get the type of template. */
  getType(): string {
    return this.name!;
  }
}
