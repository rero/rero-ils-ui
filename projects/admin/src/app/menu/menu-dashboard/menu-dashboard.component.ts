/*
 * RERO ILS UI
 * Copyright (C) 2020-2024 RERO
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
