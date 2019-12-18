/*
 * RERO ILS UI
 * Copyright (C) 2019 RERO
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

import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from './service/user.service';
import { AppConfigService } from './service/app-config.service';
import { TranslateService, LocalStorageService } from '@rero/ng-core';
import { User } from './class/user';
import { Router, NavigationStart } from '@angular/router';
import { filter } from 'rxjs/operators';
import { LibrarySwitchService } from './service/library-switch.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'admin-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, OnDestroy {

  /**
   * User
   */
  user: any;

  /**
   * Control access on template
   */
  access = false;

  /**
   * Store some observables on Subcription
   */
  private _subcription = new Subscription();

  /**
   * Constructor
   * @param userService - UserService
   * @param appConfigService - AppConfigService
   * @param translateService - TranslateService
   * @param localStorageService - LocalStorageService
   * @param librarySwitchService - LibrarySwitchService
   * @param router - Router
   */
  constructor(
    private userService: UserService,
    private appConfigService: AppConfigService,
    private translateService: TranslateService,
    private localStorageService: LocalStorageService,
    private librarySwitchService: LibrarySwitchService,
    private router: Router
    ) {
      this.initializeEvents();
    }

  ngOnInit() {
    this.userService.loadLoggedUser();
  }

  ngOnDestroy() {
    this._subcription.unsubscribe();
  }

  /**
   * Initialize App Events
   * @return void
   */
  private initializeEvents() {
    this._subcription.add(this.userService.onUserLoaded$.subscribe((data: any) => {
      if (!data.metadata) {
        this.access = false;
      }
      this.appConfigService.setSettings(data.settings);
      const language = this.appConfigService.getSettings().language;
      if (language) {
        this.translateService.setLanguage(language);
      } else {
        const browserLang = this.translateService.getBrowserLang();
        this.translateService.setLanguage(
          browserLang.match(this.appConfigService.languages.join('|')) ?
          browserLang : this.appConfigService.defaultLanguage
        );
      }
      const user = this.userService.getCurrentUser();
      if (data.metadata) {
        this.access = user.isAuthorizedAdminAccess(
          this.appConfigService.adminRoles
        );
      }
      if (this.access) {
        if (!this.localStorageService.has(User.STORAGE_KEY)) {
          this.localStorageService.set(User.STORAGE_KEY, user);
        } else {
          const userLocal = this.localStorageService.get(User.STORAGE_KEY);
          if (userLocal.pid !== user.pid) {
            this.localStorageService.set(User.STORAGE_KEY, user);
          }
          const locale = this.localStorageService.get(User.STORAGE_KEY);
          user.setCurrentLibrary(locale.currentLibrary);
        }
        this.librarySwitchService.switch(
          user.getCurrentLibrary()
        );
      }
      this.user = user;
    }));

    this._subcription.add(this.router.events.pipe(
        filter(event => event instanceof NavigationStart)
      ).subscribe((event: NavigationStart) => {
        if (
          event instanceof NavigationStart
          && this.localStorageService.has(User.STORAGE_KEY)
        ) {
          if (this.localStorageService.isExpired(
            User.STORAGE_KEY,
            this.appConfigService.sessionExpiredSeconds)
          ) {
            this.localStorageService.remove(User.STORAGE_KEY);
          } else {
            this.localStorageService.updateDate(User.STORAGE_KEY);
          }
        }

        // Library Switch menu show only on homepage
        this.librarySwitchService.show(
          (event.url === '/') ? true : false
        );
      })
    );
  }
}
