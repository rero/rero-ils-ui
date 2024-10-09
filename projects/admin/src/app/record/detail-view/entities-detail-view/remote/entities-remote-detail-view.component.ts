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
import { Component, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DetailRecord } from '@rero/ng-core/lib/record/detail/view/detail-record';
import { EntityType, EntityTypeIcon } from '@rero/shared';

@Component({
  selector: 'admin-remote-entities-remote-detail-view',
  templateUrl: './entities-remote-detail-view.component.html'
})
export class RemoteEntitiesDetailViewComponent implements DetailRecord {

  private translateService: TranslateService = inject(TranslateService);

  /** Observable resolving record data */
  record$: any;

  /** Resource type */
  type: string;

  /** Enum of type of Entity */
  entityType = EntityType;

  /**
   * Icon
   * @param type - type of contribution
   * @return object
   */
  icon(type: string): { class: string, title: string } {
    switch (type) {
      case EntityType.PERSON:
        return {
          class: EntityTypeIcon.PERSON,
          title: this.translateService.instant(EntityType.PERSON)
        };
      case EntityType.ORGANISATION:
        return {
          class: EntityTypeIcon.ORGANISATION,
          title: this.translateService.instant(EntityType.ORGANISATION)
        };
      case EntityType.TOPIC:
        return {
          class: EntityTypeIcon.TOPIC,
          title: this.translateService.instant(EntityType.TOPIC)
        };
      case EntityType.PLACE:
        return {
          class: EntityTypeIcon.PLACE,
          title: this.translateService.instant(EntityType.PLACE)
        };
      case EntityType.TEMPORAL:
        return {
          class: EntityTypeIcon.TEMPORAL,
          title: this.translateService.instant(EntityType.TEMPORAL)
        };
      default:
        return {
          class: 'fa-question',
          title: this.translateService.instant('Missing type')
        };
    }
  }
}
