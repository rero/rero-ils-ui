// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { HotkeysService } from '@ngneat/hotkeys';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ConfirmDialog } from '@openng/optimus-ui/confirmdialog';
import { DialogService } from '@openng/optimus-ui/dynamicdialog';
import { Toast } from '@openng/optimus-ui/toast';
import { AppStore, RemoteSearchComponent, User } from '@rero/shared';
import { NgxSpinnerComponent } from 'ngx-spinner';

import { MenuAppComponent } from './menu/menu-app/menu-app.component';
import { KeyboardShortcutsService } from './service/keyboard-shortcuts.service';
import { CustomShortcutHelpComponent } from './widgets/custom-shortcut-help/custom-shortcut-help.component';

@Component({
  selector: 'admin-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    LoadingBarModule,
    RouterLink,
    RemoteSearchComponent,
    MenuAppComponent,
    RouterOutlet,
    TranslatePipe,
    NgxSpinnerComponent,
    Toast,
    ConfirmDialog,
  ],
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
        closable: true,
      });
    });
  }
}
