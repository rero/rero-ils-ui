// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Component, inject, input, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GetRecordPipe, Nl2brPipe } from '@rero/ng-core';
import { TranslateDirective } from '@ngx-translate/core';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'admin-template-detail-view',
    templateUrl: './template-detail-view.component.html',
    imports: [TranslateDirective, AsyncPipe, GetRecordPipe, Nl2brPipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TemplateDetailViewComponent {

  private route: ActivatedRoute = inject(ActivatedRoute);

  readonly record = input<any>();
  readonly type = input<string>('');
}
