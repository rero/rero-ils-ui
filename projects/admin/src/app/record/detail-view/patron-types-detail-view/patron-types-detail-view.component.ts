// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { AsyncPipe, CurrencyPipe, NgClass } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Bind } from '@openng/optimus-ui/bind';
import { Panel } from '@openng/optimus-ui/panel';
import { GetRecordPipe } from '@rero/ng-core';
import { AppStore } from '@rero/shared';

@Component({
  selector: 'admin-patron-types-detail-view',
  templateUrl: './patron-types-detail-view.component.html',
  imports: [TranslatePipe, NgClass, Bind, Panel, AsyncPipe, CurrencyPipe, GetRecordPipe],
})
export class PatronTypesDetailViewComponent {
  private appStore = inject(AppStore);

  readonly record = input<any>();

  /** Resource type */
  readonly type = input<string>('');

  /** Get current organisation
   *  @return: current organisation
   */
  get organisation() {
    return this.appStore.organisation();
  }
}
