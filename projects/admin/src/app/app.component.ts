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

import { AfterViewInit, Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { HotkeysService } from '@ngneat/hotkeys';
import { AppStore, User, RemoteSearchComponent } from '@rero/shared';
import { DialogService } from 'primeng/dynamicdialog';
import { KeyboardShortcutsService } from './service/keyboard-shortcuts.service';
import { CustomShortcutHelpComponent } from './widgets/custom-shortcut-help/custom-shortcut-help.component';
import { TranslateService, TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MenuAppComponent } from './menu/menu-app/menu-app.component';
import { NgxSpinnerComponent } from 'ngx-spinner';
import { Toast } from 'primeng/toast';
import { ConfirmDialog } from 'primeng/confirmdialog';

@Component({
    selector: 'admin-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    imports: [LoadingBarModule, TranslateDirective, RouterLink, RemoteSearchComponent, MenuAppComponent, RouterOutlet, TranslatePipe, NgxSpinnerComponent, Toast, ConfirmDialog],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, AfterViewInit {

  private appStore = inject(AppStore);
  private keyboardShortcutsService: KeyboardShortcutsService = inject(KeyboardShortcutsService);
  private hotKeysService: HotkeysService = inject(HotkeysService);
  private dialogService: DialogService = inject(DialogService);
  private translateService: TranslateService = inject(TranslateService);
  /** user */
  get user(): User | null {
    return this.appStore.user();
  }

  /** Init hook */
  ngOnInit() {
    this.keyboardShortcutsService.initializeShortcuts();
  }

  /** AfterViewInit hook */
  ngAfterViewInit() {
    this.hotKeysService.registerHelpModal(() => {
      this.dialogService.open(CustomShortcutHelpComponent, {
        header: this.translateService.instant('Available Shortcuts'),
        modal: true,
        closable: true
      })
    });
  }
}
