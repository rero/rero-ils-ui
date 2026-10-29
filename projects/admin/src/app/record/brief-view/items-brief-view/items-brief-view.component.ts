// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { AsyncPipe, JsonPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { InheritedCallNumberComponent, ItemHoldingsCallNumberPipe } from '@rero/shared';

@Component({
  selector: 'admin-inventory-brief-view',
  templateUrl: './items-brief-view.component.html',
  imports: [TranslatePipe, RouterLink, InheritedCallNumberComponent, AsyncPipe, JsonPipe, ItemHoldingsCallNumberPipe],
})
export class ItemsBriefViewComponent {
  /** Record */
  record = input<any>();

  /** Type of record */
  type = input<string>();

  /** Detail Url */
  detailUrl = input<{ link: string; external: boolean }>();
}
