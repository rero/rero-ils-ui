/*
 * RERO ILS UI
 * Copyright (C) 2021-2024 RERO
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
import { NgClass } from '@angular/common';
import { Component, inject, input, ChangeDetectionStrategy} from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { DateTranslatePipe } from '@rero/ng-core';
import { AppStore, IPatron, IUser, JoinPipe } from '@rero/shared';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'public-search-patron-profile-personal',
    templateUrl: './patron-profile-personal.component.html',
    imports: [NgClass, RouterLink, TranslateDirective, TranslatePipe, DateTranslatePipe, JoinPipe, ButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PatronProfilePersonalComponent {

  private appStore = inject(AppStore);

  /** User record */
  user = input<IUser>();

  /** patron record */
  patron = input<IPatron>();

  /** Current viewcode */
  viewcode = input<string>();

  /**
   * Check if the user profile is on read only
   *
   * @returns true if the user settings is read only.
   */
  get disabledButtonOnReadyOnly(): boolean {
    return !this.appStore.settings().userProfile.readOnly;
  }
}
