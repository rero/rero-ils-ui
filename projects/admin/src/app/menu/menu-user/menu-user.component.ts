/*
 * RERO ILS UI
 * Copyright (C) 2024-2025 RERO
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
import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { cloneDeep } from 'lodash-es';
import { NgCoreTranslateService } from '@rero/ng-core';
import { AppStore } from '@rero/shared';
import { MenuTranslateService } from '../service/menu-translate.service';
import { MenuStore } from '../store/menu.store';
import { Router, RouterLink } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { map, startWith } from 'rxjs/operators';
import { MENU_IDS } from '../menu-definition/menu-ids';
import { MENU_USER } from '../menu-definition/menu-user';
import { Bind } from 'primeng/bind';
import { Menubar } from 'primeng/menubar';
import { Ripple } from 'primeng/ripple';
import { NgClass } from '@angular/common';
import { Badge } from 'primeng/badge';

@Component({
    selector: 'admin-menu-user',
    templateUrl: './menu-user.component.html',
    imports: [Bind, Menubar, Ripple, RouterLink, NgClass, Badge],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuUserComponent {

  private translateService: NgCoreTranslateService = inject(NgCoreTranslateService);
  private appStore = inject(AppStore);
  private menuStore = inject(MenuStore);
  private menuTranslateService: MenuTranslateService = inject(MenuTranslateService);
  private router: Router = inject(Router);

  private readonly currentLanguage = toSignal(
    this.translateService.onLangChange.pipe(
      map(() => this.translateService.getCurrentLang()),
      startWith(this.translateService.getCurrentLang())
    ),
    { initialValue: this.translateService.getCurrentLang() }
  );

  readonly items = computed((): MenuItem[] => {
    this.appStore.user();
    this.currentLanguage();

    const items = this.buildMenuItems();
    const libraryMenu = this.menuStore.libraryMenu()?.menu;

    return [libraryMenu, ...items].filter((item: MenuItem | undefined): item is MenuItem => !!item);
  });

  private readonly syncLibrarySelection = effect(() => {
    const library = this.menuStore.selectedLibrary();
    if (!library) {
      return;
    }

    this.menuStore.updateLibraryQueryParams(library);
    this.menuStore.clearSelectedLibrary();
    void this.router.navigate(['/']);
  });

  private buildMenuItems(): MenuItem[] {
    const userMenu = cloneDeep(MENU_USER);
    const menu = this.findRequiredItem(userMenu, MENU_IDS.USER.MENU);
    const languageMenu = this.findRequiredItem(menu.items ?? [], MENU_IDS.USER.LANGUAGE);
    languageMenu.items = this.menuStore.generateMenuLanguages();

    const items = this.menuTranslateService.process(userMenu);
    const logout = this.findRequiredItem(this.findRequiredItem(items, MENU_IDS.USER.MENU).items ?? [], MENU_IDS.USER.LOGOUT);
    logout.command = () => this.menuStore.logout();

    return items;
  }

  private findRequiredItem(items: MenuItem[], id: string): MenuItem {
    const item = items.find((menuItem: MenuItem) => menuItem.id === id);
    if (!item) {
      throw new Error(`Menu item with id "${id}" not found.`);
    }
    return item;
  }
}
