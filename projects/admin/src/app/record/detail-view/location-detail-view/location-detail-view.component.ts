// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { AsyncPipe, NgClass, NgStyle } from '@angular/common';
import { Component, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { GetRecordPipe } from '@rero/ng-core';

@Component({
  selector: 'admin-location-detail-view',
  templateUrl: './location-detail-view.component.html',
  imports: [NgClass, NgStyle, AsyncPipe, TranslatePipe, GetRecordPipe],
})
export class LocationDetailViewComponent {
  readonly record = input<any>();
  readonly type = input<string>('');
}
