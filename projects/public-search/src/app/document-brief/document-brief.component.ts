/*
 * RERO ILS UI
 * Copyright (C) 2019-2026 RERO
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
import { Component, inject, input, ChangeDetectionStrategy, computed} from '@angular/core';
import { DocumentApiService } from '../api/document-api.service';
import { ThumbnailComponent, ContributionComponent, PartOfComponent, AvailabilityComponent, MainTitlePipe, SafeUrlPipe } from '@rero/shared';
import { RecordData } from '@rero/ng-core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

type Production = {
  language: string;
  value: string;
  [key: string]: any;
}

@Component({
    selector: 'public-search-document-brief',
    templateUrl: './document-brief.component.html',
    imports: [ThumbnailComponent, ContributionComponent, PartOfComponent, AvailabilityComponent, MainTitlePipe, SafeUrlPipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocumentBriefComponent {

  protected route = inject(ActivatedRoute);
  protected documentApiService = inject(DocumentApiService);

  record = input.required<RecordData>();

  type = input.required<string>();

  detailUrl = input<{ link: string, external: boolean }>();

  viewcode = toSignal(this.route.params.pipe(map(p => p['viewcode'])));

  recordDetailUrl = computed(() => this.detailUrl()?.link.replace(':viewcode', this.viewcode()));

  /** process provision activity publications */
  get provisionActivityPublications(): any[] {
    const metadata = this.record()?.metadata as any;
    if (!metadata) {
      return [];
    }
    const { provisionActivity } = metadata;
    const publications: any[] = [];
    if (undefined === provisionActivity) {
      return publications;
    }
    provisionActivity.map((provision: any) => {
      if (provision.type === 'bf:Publication' && '_text' in provision) {
        provision._text.map((text: Production) => publications.push(text));
      }
    });
    return publications;
  }
}
