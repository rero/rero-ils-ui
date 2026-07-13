// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Component, effect, inject, input, ChangeDetectionStrategy} from '@angular/core';
import { DocumentApiService } from '@rero/shared';
import { ThumbnailComponent, ContributionComponent, PartOfComponent, AvailabilityComponent, MainTitlePipe } from '@rero/shared';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'admin-documents-brief-view',
    templateUrl: './documents-brief-view.component.html',
    imports: [ThumbnailComponent, RouterLink, ContributionComponent, PartOfComponent, AvailabilityComponent, MainTitlePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocumentsBriefViewComponent {

  public documentApiService: DocumentApiService = inject(DocumentApiService);

  record = input<any>();

  type = input<string>();

  detailUrl = input<{ link: string, external: boolean }>();

  /** Provision activities */
  provisionActivityPublications: any[] = [];

  constructor() {
    effect(() => {
      const record = this.record();
      if (record) {
        this.provisionActivityPublications = [];
        this.processProvisionActivityPublications();
      }
    });
  }

  /** process provision activity publications */
  private processProvisionActivityPublications() {
    const { provisionActivity } = this.record().metadata;
    if (undefined === provisionActivity) {
      return;
    }
    provisionActivity.map((provision: any) => {
      if (provision.type === 'bf:Publication' && '_text' in provision) {
        provision._text.map((text: any) => this.provisionActivityPublications.push(text));
      }
    });
  }
}
