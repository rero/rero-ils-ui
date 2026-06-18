// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Component, input, ChangeDetectionStrategy} from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateDirective } from '@ngx-translate/core';
import { InheritedCallNumberComponent, ItemHoldingsCallNumberPipe } from '@rero/shared';
import { AsyncPipe, JsonPipe } from '@angular/common';


@Component({
    selector: 'admin-inventory-brief-view',
    templateUrl: './items-brief-view.component.html',
    imports: [RouterLink, TranslateDirective, InheritedCallNumberComponent, AsyncPipe, JsonPipe, ItemHoldingsCallNumberPipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemsBriefViewComponent {

  /** Record */
  record = input<any>();

  /** Type of record */
  type = input<string>();

  /** Detail Url */
  detailUrl = input<{ link: string, external: boolean }>();
}
