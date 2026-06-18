// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { DateTranslatePipe, Nl2brPipe, RecordData } from '@rero/ng-core';
import { SafeUrlPipe } from '@rero/shared';
import { map } from 'rxjs';

@Component({
  selector: 'public-search-collection-brief',
  templateUrl: './collection-brief.component.html',
  imports: [DateTranslatePipe, Nl2brPipe, SafeUrlPipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CollectionBriefComponent {

  protected route = inject(ActivatedRoute);

  record = input.required<RecordData>();

  type = input.required<string>();

  detailUrl = input<{ link: string, external: boolean }>();

  viewcode = toSignal(this.route.params.pipe(map(p => p['viewcode'])));

  recordDetailUrl = computed(() => this.detailUrl()?.link.replace(':viewcode', this.viewcode()));
}
