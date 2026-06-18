// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Directive, inject, TemplateRef, input } from '@angular/core';

/** See: https://github.com/primefaces/primeng/blob/master/src/app/components/api/shared.ts */

@Directive({ 
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: '[rTemplate]' })
export class ReroTemplateDirective {

  public template: TemplateRef<any> = inject(TemplateRef);

  /** the template type. */
  readonly type = input<string | undefined>(undefined);
  /** the template name. */
  readonly name = input<string | undefined>(undefined, { alias: "rTemplate" });

  /** get the type of template. */
  getType(): string {
    return this.name()!;
  }
}
