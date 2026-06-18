// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Component, input, ChangeDetectionStrategy} from '@angular/core';
import { Bind } from 'primeng/bind';
import { Tag } from 'primeng/tag';
import { Button } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'admin-migration',
    templateUrl: './migration.component.html',
    imports: [Bind, Tag, Button, RouterLink, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MigrationDetailComponent {

  record = input<any>();

  type = input<string>();

  detailUrl = input<{ link: string; external: boolean }>();

}
