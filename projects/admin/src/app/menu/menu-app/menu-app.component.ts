// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';
import { AppStore } from '@rero/shared';
import { map, startWith } from 'rxjs/operators';
import { MENU_APP } from '../menu-definition/menu-app';
import { MenuTranslateService } from '../service/menu-translate.service';
import { MenuStore } from '../store/menu.store';
import { Bind } from 'primeng/bind';
import { Menubar } from 'primeng/menubar';
import { Ripple } from 'primeng/ripple';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { MenuUserComponent } from '../menu-user/menu-user.component';

@Component({
    selector: 'admin-menu-app',
    templateUrl: './menu-app.component.html',
    imports: [Bind, Menubar, Ripple, RouterLink, NgClass, MenuUserComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuAppComponent {

  private translateService: TranslateService = inject(TranslateService);
  private appStore = inject(AppStore);
  private menuStore = inject(MenuStore);
  private menuTranslateService: MenuTranslateService = inject(MenuTranslateService);

  private readonly currentLanguage = toSignal(
    this.translateService.onLangChange.pipe(
      map(() => this.translateService.getCurrentLang()),
      startWith(this.translateService.getCurrentLang())
    ),
    { initialValue: this.translateService.getCurrentLang() }
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
