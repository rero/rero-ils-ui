// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later

import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HotkeysService } from '@ngneat/hotkeys';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class KeyboardShortcutsService {

  private router: Router = inject(Router);
  private hotKeys: HotkeysService = inject(HotkeysService);
  private translateService: TranslateService = inject(TranslateService);

  /**
   * Initialize main application shortcuts. These shortcuts are available on all application
   */
  initializeShortcuts() {
    this.hotKeys.addShortcut({
      keys: 'esc',
      allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
      group: this.translateService.instant('Global shortcuts'),
      description: this.translateService.instant('Lose focus on the current field')
    }).subscribe(
      (output) => (output.target as HTMLElement).blur()
    );

    this.hotKeys.addShortcut({
      keys: 's',
      group: this.translateService.instant('Global shortcuts'),
      description: this.translateService.instant('Set focus on the header search input')
    }).subscribe(_e => {
      const autocompleteElement = document.getElementsByClassName('p-autocomplete')[0];
      const inputField = autocompleteElement.getElementsByTagName('input')[0];
      inputField.focus();
    });

    this.hotKeys.addShortcut({
      keys: 'q',
      group: this.translateService.instant('Global shortcuts'),
      description: this.translateService.instant('Set focus on the result list search input')
    }).subscribe(_e => {
      const inputField = document.querySelector(
        '#search'
      ) as HTMLInputElement | null;

      inputField?.focus();
    });

    this.hotKeys.addShortcut({
      keys: 'h',
      group: this.translateService.instant('Global shortcuts'),
      description: this.translateService.instant('Open the global help page')
    }).subscribe(
      _e => window.open('/help', 'rero-ils-help')
    );

    this.hotKeys.addShortcut({
      keys: 'p',
      group: this.translateService.instant('Global shortcuts'),
      description: this.translateService.instant('Open the patron search page')
    }).subscribe(
      _e => this.router.navigate(['/records', 'patrons'])
    );

    this.hotKeys.addShortcut({
      keys: 'c',
      group: this.translateService.instant('Global shortcuts'),
      description: this.translateService.instant('Open the circulation checkin interface')
    }).subscribe(
      _e => this.router.navigate(['/circulation', 'checkout'])
    );

    this.hotKeys.addShortcut({
      keys: 'r',
      group: this.translateService.instant('Global shortcuts'),
      description: this.translateService.instant('Open the main requests page')
    }).subscribe(
      _e => this.router.navigate(['/circulation', 'requests'])
    );

    this.hotKeys.addShortcut({
      keys: 'i',
      group: this.translateService.instant('Global shortcuts'),
      description: this.translateService.instant('Open the inventory list')
    }).subscribe(
      _e => this.router.navigate(['/', 'records', 'items'])
    );

  }
}
