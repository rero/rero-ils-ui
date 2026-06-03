/*
 * RERO ILS UI
 * Copyright (C) 2020-2024 RERO
 * Copyright (C) 2020-2023 UCLouvain
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
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { getTagSeverityFromStatus } from '@app/admin/utils/utils';
import { RecordService, DateTranslatePipe } from '@rero/ng-core';
import { RouterLink } from '@angular/router';
import { Bind } from 'primeng/bind';
import { Tag } from 'primeng/tag';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { map, of, switchMap } from 'rxjs';

type IllRequestRecord = {
  created?: string;
  metadata?: {
    status?: string;
    patron?: {
      pid?: string;
    };
    document?: {
      title?: string;
      authors?: string;
    };
  };
};

type PatronMetadata = {
  last_name?: string;
  first_name?: string;
  patron?: {
    barcode?: string[];
  };
};

type PatronRecord = {
  metadata?: PatronMetadata;
};

@Component({
    selector: 'admin-ill-requests-brief-view',
    templateUrl: './ill-requests-brief-view.component.html',
    imports: [RouterLink, Bind, Tag, TranslateDirective, TranslatePipe, DateTranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IllRequestsBriefViewComponent {

  private recordService: RecordService = inject(RecordService);

  // COMPONENT ATTRIBUTES =======================================================
  /** Record */
  record = input<IllRequestRecord | null>(null);
  /** Type of record */
  type = input<string>();
  /** Detail Url */
  detailUrl = input<{ link: string, external: boolean }>();

  /** the requester of the ILL request */
  private readonly requesterPid = computed(() => this.record()?.metadata?.patron?.pid ?? null);

  readonly requester = toSignal(
    toObservable(this.requesterPid).pipe(
      switchMap((pid: string | null) => {
        if (!pid) {
          return of(null);
        }
        return this.recordService.getRecord('patrons', pid).pipe(
          map((patron: PatronRecord) => patron.metadata ?? null)
        );
      })
    ),
    { initialValue: null }
  );

  readonly tagSeverity = computed(() => getTagSeverityFromStatus(this.record()?.metadata?.status));
}
