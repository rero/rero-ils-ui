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
import { Component, inject } from '@angular/core';
import { HotkeysService } from '@ngneat/hotkeys';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
    selector: 'admin-custom-shortcut-help',
    templateUrl: './custom-shortcut-help.component.html',
    styleUrls: ['./custom-shortcut-help.component.scss'],
    standalone: false
})
export class CustomShortcutHelpComponent {

  private hotKeysService: HotkeysService = inject(HotkeysService);
  private ref = inject(DynamicDialogRef);

  /** the list of implemented shortcuts */
  hotkeys = this.hotKeysService.getShortcuts();

  closeModal() {
    this.ref.close();
  }
}
