// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Component, input, ChangeDetectionStrategy} from '@angular/core';
import { TranslateDirective } from '@ngx-translate/core';
import { ThumbnailComponent, ContributionComponent, InheritedCallNumberComponent, DocumentProvisionActivityPipe, ItemHoldingsCallNumberPipe } from '@rero/shared';
import { RouterLink } from '@angular/router';
import { AsyncPipe, JsonPipe, KeyValuePipe } from '@angular/common';
import { CallbackArrayFilterPipe, GetRecordPipe } from '@rero/ng-core';

@Component({
    selector: 'admin-collection-items',
    templateUrl: './collection-items.component.html',
    imports: [TranslateDirective, ThumbnailComponent, RouterLink, ContributionComponent, InheritedCallNumberComponent, AsyncPipe, JsonPipe, KeyValuePipe, CallbackArrayFilterPipe, DocumentProvisionActivityPipe, GetRecordPipe, ItemHoldingsCallNumberPipe],
  changeDetection: ChangeDetectionStrategy.OnPush
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
    return ('key' in element && element.key === 'bf:Publication');
  }
}
