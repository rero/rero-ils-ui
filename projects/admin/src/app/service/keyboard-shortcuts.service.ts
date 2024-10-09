/*
 * RERO ILS UI
 * Copyright (C) 2020-2024 RERO
 * Copyright (C) 2020 UCLouvain
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
      keys: 'shift./',
      group: this.translateService.instant('Global shortcuts'),
      description: this.translateService.instant('Set focus on the header search input')
    }).subscribe(e => {
      const autocompleteElement = document.getElementsByClassName('rero-ils-autocomplete')[0];
      const inputField = autocompleteElement.getElementsByTagName('input')[0];
      inputField.focus();
    });

    this.hotKeys.addShortcut({
      keys: 'h',
      group: this.translateService.instant('Global shortcuts'),
      description: this.translateService.instant('Open the global help page')
    }).subscribe(
      _ => window.open('/help', 'rero-ils-help')
    );

    this.hotKeys.addShortcut({
      keys: 'p',
      group: this.translateService.instant('Global shortcuts'),
      description: this.translateService.instant('Open the patron search page')
    }).subscribe(
      _ => this.router.navigate(['/records', 'patrons'])
    );

    this.hotKeys.addShortcut({
      keys: 'c',
      group: this.translateService.instant('Global shortcuts'),
      description: this.translateService.instant('Open the circulation checkin interface')
    }).subscribe(
      _ => this.router.navigate(['/circulation', 'checkout'])
    );

    this.hotKeys.addShortcut({
      keys: 'r',
      group: this.translateService.instant('Global shortcuts'),
      description: this.translateService.instant('Open the main requests page')
    }).subscribe(
      _ => this.router.navigate(['/circulation', 'requests'])
    );

    this.hotKeys.addShortcut({
      keys: 'i',
      group: this.translateService.instant('Global shortcuts'),
      description: this.translateService.instant('Open the inventory list')
    }).subscribe(
      _ => this.router.navigate(['/', 'records', 'items'])
    );

  }
}
