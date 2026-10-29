// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Component, computed, inject, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { getTagSeverityFromStatus } from '@app/admin/utils/utils';
import { TranslatePipe } from '@ngx-translate/core';
import { Bind } from '@openng/optimus-ui/bind';
import { Tag } from '@openng/optimus-ui/tag';
import { DateTranslatePipe, RecordService } from '@rero/ng-core';
import { catchError, map, of, switchMap } from 'rxjs';

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
  imports: [RouterLink, Bind, Tag, TranslatePipe, DateTranslatePipe],
})
export class IllRequestsBriefViewComponent {
  private recordService: RecordService = inject(RecordService);

  // COMPONENT ATTRIBUTES =======================================================
  /** Record */
  record = input<IllRequestRecord | null>(null);
  /** Type of record */
  type = input<string>();
  /** Detail Url */
  detailUrl = input<{ link: string; external: boolean }>();

  /** the requester of the ILL request */
  private readonly requesterPid = computed(() => this.record()?.metadata?.patron?.pid ?? null);

  readonly requester = toSignal(
    toObservable(this.requesterPid).pipe(
      switchMap((pid: string | null) => {
        if (!pid) {
          return of(null);
        }
        return this.recordService.getRecord('patrons', pid).pipe(
          map((patron: PatronRecord) => patron.metadata ?? null),
          catchError(() => of(null)),
        );
      }),
    ),
    { initialValue: null },
  );

  readonly tagSeverity = computed(() => getTagSeverityFromStatus(this.record()?.metadata?.status));
}
