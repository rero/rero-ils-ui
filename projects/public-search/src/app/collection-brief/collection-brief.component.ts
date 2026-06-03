/*
 * RERO ILS UI
 * Copyright (C) 2020-2025 RERO
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
