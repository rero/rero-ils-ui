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

import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { HotkeysService } from '@ngneat/hotkeys';
import { User, UserService } from '@rero/shared';
import { DialogService } from 'primeng/dynamicdialog';
import { KeyboardShortcutsService } from './service/keyboard-shortcuts.service';
import { CustomShortcutHelpComponent } from './widgets/custom-shortcut-help/custom-shortcut-help.component';

@Component({
  selector: 'admin-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {

  private userService: UserService = inject(UserService);
  private keyboardShortcutsService: KeyboardShortcutsService = inject(KeyboardShortcutsService);
  private hotKeysService: HotkeysService = inject(HotkeysService);
  private dialogService: DialogService = inject(DialogService);

  /** user */
  get user(): User {
    return this.userService.user;
  }

  /** Init hook */
  ngOnInit() {
    this.keyboardShortcutsService.initializeShortcuts();
  }

  /** AfterViewInit hook */
  ngAfterViewInit() {
    this.hotKeysService.registerHelpModal(() => {
      this.dialogService.open(CustomShortcutHelpComponent, {})
    });
  }
}
