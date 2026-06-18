// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Component, computed, input, ChangeDetectionStrategy} from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContributionComponent } from '../../../view/contribution/contribution.component';
import { TruncateTextPipe, JsonObject } from '@rero/ng-core';
import { IdentifiedByLabelPipe } from '../../../pipe/identifiedby-label.pipe';
import { JoinPipe } from '../../../pipe/join.pipe';
import { MainTitlePipe } from '../../../pipe/main-title.pipe';

@Component({
    selector: 'shared-document-brief-view',
    templateUrl: './document-brief-view.component.html',
    imports: [RouterLink, ContributionComponent, TruncateTextPipe, IdentifiedByLabelPipe, JoinPipe, MainTitlePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocumentBriefViewComponent {

  /** Record */
  readonly record = input<JsonObject>();

  /** Provision activities (derived from record) */
  readonly provisionActivityPublications = computed<any[]>(() => {
    const publications: any[] = [];
    const record = this.record() as any;
    if (record?.provisionActivity) {
      record.provisionActivity.forEach((provision: any) => {
        if (provision.type === 'bf:Publication' && '_text' in provision) {
          publications.push(...provision._text.map(text => text.value));
        }
      });
    }
    return publications;
  });
}
