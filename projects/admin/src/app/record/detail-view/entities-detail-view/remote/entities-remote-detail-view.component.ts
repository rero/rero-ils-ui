// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Component, inject, input, ChangeDetectionStrategy} from '@angular/core';
import { TranslateService, TranslateDirective, TranslatePipe } from '@ngx-translate/core';

import { EntityType, EntityTypeIcon, ExtractSourceFieldPipe } from '@rero/shared';
import { Bind } from 'primeng/bind';
import { Tag } from 'primeng/tag';
import { Panel } from 'primeng/panel';
import { RemoteEntitiesPersonDetailViewComponent } from './remote-person-detail-view/remote-entities-person-detail-view.component';
import { RemoteEntitiesOrganisationDetailViewComponent } from './remote-organisation-detail-view/remote-entities-organisation-detail-view.component';
import { RemoteTopicDetailViewComponent } from './remote-topic-detail-view/remote-topic-detail-view.component';
import { UpperCasePipe } from '@angular/common';

@Component({
    selector: 'admin-remote-entities-remote-detail-view',
    templateUrl: './entities-remote-detail-view.component.html',
    imports: [Bind, Tag, Panel, RemoteEntitiesPersonDetailViewComponent, RemoteEntitiesOrganisationDetailViewComponent, RemoteTopicDetailViewComponent, TranslateDirective, UpperCasePipe, TranslatePipe, ExtractSourceFieldPipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RemoteEntitiesDetailViewComponent {

  private translateService: TranslateService = inject(TranslateService);

  readonly record = input<any>();

  /** Resource type */
  readonly type = input<string>('');

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

  identifiedByFilter(identifiedBy: any[]): any[] {
    return identifiedBy.filter((el: any) => el.source !== 'RERO' && el.type === 'uri');
  }
}
