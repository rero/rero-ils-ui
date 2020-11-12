/*
 * RERO ILS UI
 * Copyright (C) 2020 RERO
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

import { Component, Input, OnInit } from '@angular/core';
import { HotkeysService } from '@ngneat/hotkeys';
import { TranslateService } from '@ngx-translate/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'admin-custom-shortcut-help',
  templateUrl: './custom-shortcut-help.component.html',
  styleUrls: ['./custom-shortcut-help.component.scss']
})
export class CustomShortcutHelpComponent {

  /** the title of the modal window */
  @Input() title = this._translateService.instant('Available Shortcuts');
  /** the list of implemented shortcuts */
  hotkeys = this._hotKeysService.getShortcuts();

  /**
   * Constructor
   * @param _hotKeysService - HotkeysService
   * @param _bsModalRef - BsModalRef
   * @param _translateService - TranslateService
   */
  constructor(
    private _hotKeysService: HotkeysService,
    protected _bsModalRef: BsModalRef,
    private _translateService: TranslateService
  ) {}

  /**
   * Close the modal
   */
  closeModal() {
    this._bsModalRef.hide();
  }

}
