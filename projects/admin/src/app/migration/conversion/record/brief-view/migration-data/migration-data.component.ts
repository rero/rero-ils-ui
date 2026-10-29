// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { Tag } from '@openng/optimus-ui/tag';
import { DateTranslatePipe } from '@rero/ng-core';
import { MainTitlePipe } from '@rero/shared';

@Component({
  selector: 'admin-migration-data',
  templateUrl: './migration-data.component.html',
  imports: [RouterLink, Tag, DateTranslatePipe, MainTitlePipe, TranslatePipe],
})
export class MigrationDataBriefComponent {
  record = input<any>();

  type = input<string>();

  detailUrl = input<{ link: string; external: boolean }>();

  status = computed(() => this.record()?.metadata?.conversion?.status);
}
