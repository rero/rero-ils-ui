// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { NgClass } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { ButtonModule } from '@openng/optimus-ui/button';
import { DateTranslatePipe } from '@rero/ng-core';
import { AppStore, IPatron, IUser, JoinPipe } from '@rero/shared';

@Component({
  selector: 'public-search-patron-profile-personal',
  templateUrl: './patron-profile-personal.component.html',
  imports: [NgClass, RouterLink, TranslatePipe, DateTranslatePipe, JoinPipe, ButtonModule],
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
