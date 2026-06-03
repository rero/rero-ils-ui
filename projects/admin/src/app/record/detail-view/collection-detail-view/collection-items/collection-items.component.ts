/*
 * RERO ILS UI
 * Copyright (C) 2020 RERO
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
