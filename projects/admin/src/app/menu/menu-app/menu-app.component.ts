// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { NgClass } from '@angular/common';
import { Component, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Bind } from '@openng/optimus-ui/bind';
import { Menubar } from '@openng/optimus-ui/menubar';
import { Ripple } from '@openng/optimus-ui/ripple';
import { AppStore } from '@rero/shared';
import { map, startWith } from 'rxjs/operators';

import { MENU_APP } from '../menu-definition/menu-app';
import { MenuUserComponent } from '../menu-user/menu-user.component';
import { MenuTranslateService } from '../service/menu-translate.service';
import { MenuStore } from '../store/menu.store';

@Component({
  selector: 'admin-menu-app',
  templateUrl: './menu-app.component.html',
  imports: [Bind, Menubar, Ripple, RouterLink, NgClass, MenuUserComponent],
})
export class MenuAppComponent {
  private translateService: TranslateService = inject(TranslateService);
  private appStore = inject(AppStore);
  private menuStore = inject(MenuStore);
  private menuTranslateService: MenuTranslateService = inject(MenuTranslateService);

  private readonly currentLanguage = toSignal(
    this.translateService.onLangChange.pipe(
      map(() => this.translateService.getCurrentLang()),
      startWith(this.translateService.getCurrentLang()),
    ),
    { initialValue: this.translateService.getCurrentLang() },
  );

  readonly items = computed(() => {
    this.currentLanguage();
    return this.menuTranslateService.process(this.menuStore.applicationMenuItems());
  });

  private readonly initializeMenu = effect(() => {
    if (!this.appStore.user()) {
      return;
    }

    this.menuStore.generateAppMenu(MENU_APP);
  });
}
