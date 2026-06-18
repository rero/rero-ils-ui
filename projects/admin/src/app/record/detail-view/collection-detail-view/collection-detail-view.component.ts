// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { Bind } from 'primeng/bind';
import { Tag } from 'primeng/tag';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { NgClass, AsyncPipe } from '@angular/common';
import { CollectionItemsComponent } from './collection-items/collection-items.component';
import { DateTranslatePipe, GetRecordPipe, Nl2brPipe } from '@rero/ng-core';


@Component({
    selector: 'admin-collection-detail-view',
    templateUrl: './collection-detail-view.component.html',
    imports: [Bind, Tag, TranslateDirective, NgClass, CollectionItemsComponent, AsyncPipe, TranslatePipe, DateTranslatePipe, GetRecordPipe, Nl2brPipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CollectionDetailViewComponent {

  readonly record = input<any>();
  readonly type = input<string>('');
}
