// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';
import { map, startWith } from 'rxjs/operators';
import { MenuTranslateService } from '../service/menu-translate.service';
import { MenuStore } from '../store/menu.store';
import { Bind } from 'primeng/bind';
import { Card } from 'primeng/card';
import { Ripple } from 'primeng/ripple';
import { RouterLink } from '@angular/router';
import { TieredMenu } from 'primeng/tieredmenu';

@Component({
    selector: 'admin-menu-dashboard',
    templateUrl: './menu-dashboard.component.html',
    imports: [Bind, Card, Ripple, RouterLink, TieredMenu],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuDashboardComponent {

  private translateService: TranslateService = inject(TranslateService);
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
}
