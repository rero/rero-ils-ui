// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
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
