// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

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
