/*
 * RERO ILS UI
 * Copyright (C) 2023 RERO
 * Copyright (C) 2023 UCLouvain
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
