/*
 * RERO ILS UI
 * Copyright (C) 2019-2023 RERO
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
import { Component, effect, inject, input, ChangeDetectionStrategy} from '@angular/core';
import { DocumentApiService } from '@app/admin/api/document-api.service';
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
