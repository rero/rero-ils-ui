/*
 * RERO ILS UI
 * Copyright (C) 2024 RERO
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
import { Tag } from 'primeng/tag';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { DateTranslatePipe } from '@rero/ng-core';
import { MainTitlePipe } from '@rero/shared';

@Component({
    selector: 'admin-migration-data',
    templateUrl: './migration-data.component.html',
    imports: [RouterLink, Tag, TranslateDirective, DateTranslatePipe, MainTitlePipe, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MigrationDataBriefComponent {
  record = input<any>();

  type = input<string>();

  detailUrl = input<{ link: string; external: boolean }>();

  status = computed(() => this.record()?.metadata?.conversion?.status);

}
