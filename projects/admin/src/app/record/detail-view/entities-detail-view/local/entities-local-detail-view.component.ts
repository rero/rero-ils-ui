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
import { Component, inject, input, ChangeDetectionStrategy} from '@angular/core';
import { Router } from '@angular/router';
import { OperationLogsService } from '@rero/shared';
import { TranslateService, TranslateDirective, TranslatePipe } from '@ngx-translate/core';

import { Entity, EntityType, EntityTypeIcon } from '@rero/shared';
import { Bind } from 'primeng/bind';
import { Tag } from 'primeng/tag';
import { Panel } from 'primeng/panel';
import { LocalOrganisationDetailViewComponent } from './local-organisation-detail-view/local-organisation-detail-view.component';
import { LocalPersonDetailViewComponent } from './local-person-detail-view/local-person-detail-view.component';
import { LocalPlaceDetailViewComponent } from './local-place-detail-view/local-place-detail-view.component';
import { LocalTopicDetailViewComponent } from './local-topic-detail-view/local-topic-detail-view.component';
import { LocalWorkDetailViewComponent } from './local-work-detail-view/local-work-detail-view.component';

@Component({
    selector: 'admin-entities-local-detail-view',
    templateUrl: './entities-local-detail-view.component.html',
    imports: [Bind, Tag, Panel, TranslateDirective, LocalOrganisationDetailViewComponent, LocalPersonDetailViewComponent, LocalPlaceDetailViewComponent, LocalTopicDetailViewComponent, LocalWorkDetailViewComponent, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EntitiesLocalDetailViewComponent {

  private translateService: TranslateService = inject(TranslateService);
  private router: Router = inject(Router);
  private operationLogsService: OperationLogsService = inject(OperationLogsService);

  readonly record = input<any>();

  /** Resource type */
  readonly type = input<string>('');

  /** Enum of type of Entity */
  entityType = EntityType;

  /** Is operation log enabled */
  readonly isEnabledOperationLog = this.operationLogsService.isLogVisible('local_entities');

  /**
   * Icon
   * @param type - type of contribution
   * @return object
   */
  icon(type: string): { class: string, title: string } {
    switch (type) {
      case EntityType.ORGANISATION:
        return { class: EntityTypeIcon.ORGANISATION, title: this.translateService.instant('Organisation') };
      case EntityType.PERSON:
        return { class: EntityTypeIcon.PERSON, title: this.translateService.instant('Person') };
      case EntityType.PLACE:
        return { class: EntityTypeIcon.PLACE, title: this.translateService.instant('Place') };
      case EntityType.TEMPORAL:
        return { class: EntityTypeIcon.TEMPORAL, title: this.translateService.instant('Temporal') };
      case EntityType.TOPIC:
        return { class: EntityTypeIcon.TOPIC, title: this.translateService.instant('Topic') };
      case EntityType.WORK:
        return { class: EntityTypeIcon.WORK, title: this.translateService.instant('Work') };
      default:
        return { class: 'fa-question', title: this.translateService.instant('Missing type') };
    }
  }

  /**
   * Launch an expert search on the document view.
   * @param metadata - the record metadata
   */
  search(metadata: any): void {
    this.router.navigate(
      ['/records', 'documents'],
      {
        queryParams: { q: Entity.generateSearchQuery(metadata.type, 'local', metadata.pid), simple: '0' },
        skipLocationChange: true
      },
    );
  }
}
