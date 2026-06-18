// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Component, input, ChangeDetectionStrategy} from '@angular/core';
import { Paginator } from '../paginator';
import { Bind } from 'primeng/bind';
import { Button } from 'primeng/button';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'shared-search-show-more-pager',
    templateUrl: './show-more-pager.component.html',
    imports: [Bind, Button, TranslateDirective, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShowMorePagerComponent {

  /** Records paginator */
  readonly paginator = input<Paginator>();

  /** Show more button id */
  readonly id = input<string>();
}
