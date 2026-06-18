// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { NgClass } from '@angular/common';
import { Bind } from 'primeng/bind';
import { Panel } from 'primeng/panel';

@Component({
    selector: 'admin-item-type-detail-view',
    templateUrl: './item-type-detail-view.component.html',
    imports: [TranslateDirective, NgClass, Bind, Panel, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemTypeDetailViewComponent {

  readonly record = input<any>();
  readonly type = input<string>('');
}
