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
import { TranslateService } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { MENU_APP } from '../menu-definition/menu-app';
import { ISwitchLibrary, LibraryService } from '../service/library.service';
import { MenuTranslateService } from '../service/menu-translate.service';
import { MenuService } from '../service/menu.service';

@Component({
  selector: 'admin-menu-app',
  templateUrl: './menu-app.component.html',
})
export class MenuAppComponent implements OnInit, OnDestroy {

  private translateService: TranslateService = inject(TranslateService);
  private menuService: MenuService = inject(MenuService);
  private menuTranslateService: MenuTranslateService = inject(MenuTranslateService);
  private libraryService: LibraryService = inject(LibraryService);

  items: MenuItem[] = [];

  subscription = new Subscription();

  ngOnInit(): void {
    this.generateMenu();
    this.subscription.add(
      this.translateService.onLangChange.subscribe(() => this.changeLanguage()
      )
    );
    this.subscription.add(
      this.libraryService.switch$.subscribe((library: ISwitchLibrary) => this.menuService.updateLibraryLink(library))
    )
  }

  ngOnDestroy(): void {
      this.subscription.unsubscribe();
  }

  private generateMenu(): void {
    this.items = this.menuService.generateAppMenu(MENU_APP);
    this.items = this.menuTranslateService.process(this.items);
  }

  private changeLanguage(): void {
    this.items = this.menuTranslateService.process(this.items);
  }
}
