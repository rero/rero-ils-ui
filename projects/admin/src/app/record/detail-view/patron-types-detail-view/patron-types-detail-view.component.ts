/*
 * RERO ILS UI
 * Copyright (C) 2019-2024 RERO
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, version 3 of the License.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
import { Component, inject, input, ChangeDetectionStrategy} from '@angular/core';
import { TranslateDirective } from '@ngx-translate/core';
import { AppStore } from '@rero/shared';
import { NgClass, AsyncPipe } from '@angular/common';
import { CentsCurrencyPipe } from '../../../acquisition/pipes/cents-currency.pipe';
import { Bind } from 'primeng/bind';
import { Panel } from 'primeng/panel';
import { GetRecordPipe } from '@rero/ng-core';

@Component({
    selector: 'admin-patron-types-detail-view',
    templateUrl: './patron-types-detail-view.component.html',
    imports: [TranslateDirective, NgClass, Bind, Panel, AsyncPipe, CentsCurrencyPipe, GetRecordPipe],
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
