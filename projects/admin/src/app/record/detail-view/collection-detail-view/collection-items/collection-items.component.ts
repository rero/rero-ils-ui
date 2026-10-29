// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { AsyncPipe, JsonPipe, KeyValuePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { CallbackArrayFilterPipe, GetRecordPipe } from '@rero/ng-core';
import {
  ContributionComponent,
  DocumentProvisionActivityPipe,
  InheritedCallNumberComponent,
  ItemHoldingsCallNumberPipe,
  ThumbnailComponent,
} from '@rero/shared';

@Component({
  selector: 'admin-collection-items',
  templateUrl: './collection-items.component.html',
  imports: [
    TranslatePipe,
    ThumbnailComponent,
    RouterLink,
    ContributionComponent,
    InheritedCallNumberComponent,
    AsyncPipe,
    JsonPipe,
    KeyValuePipe,
    CallbackArrayFilterPipe,
    DocumentProvisionActivityPipe,
    GetRecordPipe,
    ItemHoldingsCallNumberPipe,
  ],
})
export class CollectionItemsComponent {
  /** Items for current collection */
  items = input([]);

  /**
   * Allow to filter provisionActivity keeping only activities that are 'Publication'
   * @param element: the element to check
   * @return True if element is a 'Publication', False otherwise
   */
  filterPublicationProvisionActivity(element: any): boolean {
    return 'key' in element && element.key === 'bf:Publication';
  }
}
