// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

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
