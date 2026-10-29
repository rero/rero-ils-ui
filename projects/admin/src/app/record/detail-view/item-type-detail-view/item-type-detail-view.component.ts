// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { NgClass } from '@angular/common';
import { Component, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Bind } from '@openng/optimus-ui/bind';
import { Panel } from '@openng/optimus-ui/panel';

@Component({
  selector: 'admin-item-type-detail-view',
  templateUrl: './item-type-detail-view.component.html',
  imports: [NgClass, Bind, Panel, TranslatePipe],
})
export class ItemTypeDetailViewComponent {
  readonly record = input<any>();
  readonly type = input<string>('');
}
