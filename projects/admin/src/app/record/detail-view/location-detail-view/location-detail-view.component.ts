// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { NgClass, NgStyle, AsyncPipe } from '@angular/common';
import { GetRecordPipe } from '@rero/ng-core';

@Component({
    selector: 'admin-location-detail-view',
    templateUrl: './location-detail-view.component.html',
    imports: [TranslateDirective, NgClass, NgStyle, AsyncPipe, TranslatePipe, GetRecordPipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocationDetailViewComponent {

  readonly record = input<any>();
  readonly type = input<string>('');
}
