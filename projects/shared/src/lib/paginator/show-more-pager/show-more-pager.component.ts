// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Component, input } from '@angular/core';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { Bind } from '@openng/optimus-ui/bind';
import { Button } from '@openng/optimus-ui/button';

import { Paginator } from '../paginator';

@Component({
  selector: 'shared-search-show-more-pager',
  templateUrl: './show-more-pager.component.html',
  imports: [Bind, Button, TranslateDirective, TranslatePipe],
})
export class ShowMorePagerComponent {
  /** Records paginator */
  readonly paginator = input<Paginator>();

  /** Show more button id */
  readonly id = input<string>();
}
