/*
 * RERO ILS UI
 * Copyright (C) 2024 RERO
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
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NgCoreTranslateService } from '@rero/ng-core';
import { MenuService } from '../service/menu.service';
import { MenuTranslateService } from '../service/menu-translate.service';
import { ISwitchLibrary, LibraryService } from '../service/library.service';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { MENU_IDS } from '../menu-definition/menu-ids';
import { MENU_USER } from '../menu-definition/menu-user';

@Component({
  selector: 'admin-menu-user',
  templateUrl: './menu-user.component.html'
})
export class MenuUserComponent implements OnInit, OnDestroy {

  private translateService: NgCoreTranslateService = inject(NgCoreTranslateService);
  private menuService: MenuService = inject(MenuService);
  private menuTranslateService: MenuTranslateService = inject(MenuTranslateService);
  private libraryService: LibraryService = inject(LibraryService);
  private router: Router = inject(Router);

  items: MenuItem[] = [];

  subscription = new Subscription();

  ngOnInit(): void {
    this.generateMenu();
    this.subscription.add(
      this.translateService.onLangChange.subscribe(() => this.changeLanguage())
    );
    this.subscription.add(
      this.menuService.generateMenuLibrary$().subscribe((menu: any) => {
        this.items = [menu.menu, ...this.items];
      })
    );
    this.subscription.add(
      this.libraryService.switch$.subscribe((library: ISwitchLibrary) => this.updateLibraryMenuAndRedirect(library))
    );
    this.subscription.add(
      this.libraryService.switch$.subscribe((library: ISwitchLibrary) => this.menuService.updateLibraryQueryParams(library))
    )
  }

  ngOnDestroy(): void {
      this.subscription.unsubscribe();
  }

  private generateMenu(): void {
    MENU_USER
      .find((item: MenuItem) => item.id === MENU_IDS.USER.MENU).items
      .find((item: MenuItem) => item.id === MENU_IDS.USER.LANGUAGE).items = this.menuService.generateMenuLanguages();
    this.items = this.menuTranslateService.process(MENU_USER);
    const logout = this.items
      .find((item: MenuItem) => item.id === MENU_IDS.USER.MENU).items
      .find((item: MenuItem) => item.id === MENU_IDS.USER.LOGOUT);
    logout['command'] = () => this.menuService.logout();
  }

  private changeLanguage(): void {
    this.updateLanguageMenu();
    this.items = this.menuTranslateService.process(this.items);
  }

  private updateLibraryMenuAndRedirect(library: ISwitchLibrary): void {
    const element = this.items.find((item: MenuItem) => item.id === MENU_IDS.LIBRARY_MENU);
    element.label = library.code;
    element.items.map((item: MenuItem) => item.styleClass = item.pid === library.pid ? 'font-bold' : '');
    this.router.navigate(['/']);
  }

  private updateLanguageMenu(): void {
    this.items
    .find((item: MenuItem) => item.id === MENU_IDS.USER.MENU).items
    .find((item: MenuItem) => item.id === MENU_IDS.USER.LANGUAGE).items
    .map((item: MenuItem) => item.styleClass = item.id === `lang-${this.translateService.currentLang}` ? 'font-bold' : '')
  }
}
