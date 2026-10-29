// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Bind } from '@openng/optimus-ui/bind';
import { Card } from '@openng/optimus-ui/card';
import { Ripple } from '@openng/optimus-ui/ripple';
import { TieredMenu } from '@openng/optimus-ui/tieredmenu';
import { map, startWith } from 'rxjs/operators';

import { MenuTranslateService } from '../service/menu-translate.service';
import { MenuStore } from '../store/menu.store';

@Component({
  selector: 'admin-menu-dashboard',
  templateUrl: './menu-dashboard.component.html',
  imports: [Bind, Card, Ripple, RouterLink, TieredMenu],
})
export class MenuDashboardComponent {
  private translateService: TranslateService = inject(TranslateService);
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
}
