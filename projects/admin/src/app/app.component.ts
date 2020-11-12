/*
 * RERO ILS UI
 * Copyright (C) 2019 RERO
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

import { AfterViewInit, Component, OnInit } from '@angular/core';
import { HotkeysService } from '@ngneat/hotkeys';
import { BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { AppRouterEventService } from './service/app-router-event.service';
import { KeyboardShortcutsService } from './service/keyboard-shortcuts.service';
import { NavigateService } from './service/navigate.service';
import { UserService } from './service/user.service';
import { CustomShortcutHelpComponent } from './widgets/custom-shortcut-help/custom-shortcut-help.component';

@Component({
  selector: 'admin-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {

  /** Allow interface access */
  get allowAccess() {
    return this._userService.allowAccess;
  }

  /** is user loaded */
  get userLoaded() {
    return this._userService.userLoaded;
  }

  /**
   * Constructor
   * @param _userService - UserService
   * @param _appRouterEventService - AppRouterEventService
   * @param _spinner - NgxSpinnerService
   * @param _navigateService - NavigateService
   * @param _keyboardShortcutsService - KeyboardShortcutsService
   * @param _hotKeysService - HotkeysService,
   * @param _modalService - BsModalService
   */
  constructor(
    private _userService: UserService,
    private _appRouterEventService: AppRouterEventService,
    private _spinner: NgxSpinnerService,
    private _navigateService: NavigateService,
    private _keyboardShortcutsService: KeyboardShortcutsService,
    private _hotKeysService: HotkeysService,
    private _modalService: BsModalService
  ) {}

  /** Init hook */
  ngOnInit() {
    this._spinner.show();
    this._appRouterEventService.initializeEvents();
    this._navigateService.initialize();
    this._keyboardShortcutsService.initializeShortcuts();
    this._spinner.hide();
  }

  /** AfterViewInit hook */
  ngAfterViewInit() {
    this._hotKeysService.registerHelpModal(() => {
      this._modalService.show(CustomShortcutHelpComponent);
    });
  }
}
