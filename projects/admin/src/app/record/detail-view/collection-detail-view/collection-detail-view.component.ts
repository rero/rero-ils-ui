// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { AsyncPipe, NgClass } from '@angular/common';
import { Component, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Bind } from '@openng/optimus-ui/bind';
import { Tag } from '@openng/optimus-ui/tag';
import { DateTranslatePipe, GetRecordPipe, Nl2brPipe } from '@rero/ng-core';

import { CollectionItemsComponent } from './collection-items/collection-items.component';

@Component({
  selector: 'admin-collection-detail-view',
  templateUrl: './collection-detail-view.component.html',
  imports: [
    Bind,
    Tag,
    NgClass,
    CollectionItemsComponent,
    AsyncPipe,
    TranslatePipe,
    DateTranslatePipe,
    GetRecordPipe,
    Nl2brPipe,
  ],
})
export class CollectionDetailViewComponent {
  readonly record = input<any>();
  readonly type = input<string>('');
}
