// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { AsyncPipe } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { GetRecordPipe, Nl2brPipe } from '@rero/ng-core';

@Component({
  selector: 'admin-template-detail-view',
  templateUrl: './template-detail-view.component.html',
  imports: [TranslatePipe, AsyncPipe, GetRecordPipe, Nl2brPipe],
})
export class TemplateDetailViewComponent {
  private route: ActivatedRoute = inject(ActivatedRoute);

  readonly record = input<any>();
  readonly type = input<string>('');
}
