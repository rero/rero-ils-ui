// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Component, inject, input, ChangeDetectionStrategy} from '@angular/core';
import { Router } from '@angular/router';
import { AppStore } from '@rero/shared';
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
  protected appStore = inject(AppStore);

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
        return { class: 'fa-solid fa-question', title: this.translateService.instant('Missing type') };
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
