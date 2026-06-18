// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Component, inject, input, ChangeDetectionStrategy} from '@angular/core';
import { TranslateDirective } from '@ngx-translate/core';
import { AppStore } from '@rero/shared';
import { NgClass, AsyncPipe, CurrencyPipe } from '@angular/common';
import { Bind } from 'primeng/bind';
import { Panel } from 'primeng/panel';
import { GetRecordPipe } from '@rero/ng-core';

@Component({
    selector: 'admin-patron-types-detail-view',
    templateUrl: './patron-types-detail-view.component.html',
    imports: [TranslateDirective, NgClass, Bind, Panel, AsyncPipe, CurrencyPipe, GetRecordPipe],
  changeDetection: ChangeDetectionStrategy.OnPush
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
