// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Component, inject, ChangeDetectionStrategy} from '@angular/core';
import { HotkeysService, HotkeysShortcutPipe } from '@ngneat/hotkeys';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
    selector: 'admin-custom-shortcut-help',
    templateUrl: './custom-shortcut-help.component.html',
    styleUrls: ['./custom-shortcut-help.component.scss'],
    imports: [HotkeysShortcutPipe],
  changeDetection: ChangeDetectionStrategy.OnPush
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
