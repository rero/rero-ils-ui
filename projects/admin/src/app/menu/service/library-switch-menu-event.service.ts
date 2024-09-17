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
import { inject, Injectable } from '@angular/core';
import { PRIMARY_OUTLET, Router } from '@angular/router';
import { AppConfigService } from '@app/admin/service/app-config.service';
import { TranslateService } from '@ngx-translate/core';
import { MenuItem } from '@rero/ng-core';
import { UserService } from '@rero/shared';
import { ConfirmationService } from 'primeng/api';
import { LibrarySwitchService } from './library-switch.service';

@Injectable({
  providedIn: 'root'
})
export class LibrarySwitchMenuEventService {

  userService = inject(UserService);
  router = inject(Router);
  appConfigService = inject(AppConfigService);
  confirmationService = inject(ConfirmationService);
  translateService = inject(TranslateService);
  librarySwitchService = inject(LibrarySwitchService);

  /**
   * Event on menu click
   * @param event - MenuItem
   */
  eventMenuClick(event: MenuItem): void {
    if (this.userService.user.currentLibrary !== event.getExtra('id')) {
      const { url } = this.router;
      const urlTree = this.router.parseUrl(url);
      const children = urlTree.root.children[PRIMARY_OUTLET];
      if (children) {
        const urlParams = children.segments.map(segment => segment.path);
        if (
          this.appConfigService.librarySwitchCheckParamsUrl
            .some(param => urlParams.includes(param))
        ) {
          this.confirmationService.confirm({
            header: this.translateService.instant('Quit the page'),
            message: this.translateService.instant('Do you want to quit the page? The changes made so far will be lost.'),
            accept: () => this._switchAndNavigate(event.getExtra('id'))
          });
        } else {
          this._switchAndNavigate(event.getExtra('id'));
        }
      } else {
        this._switchAndNavigate(event.getExtra('id'));
      }
    }
  }

  /**
   * Switch and navigate
   * @param id - string, library pid
   */
  private _switchAndNavigate(id: string): void {
    this.librarySwitchService.switch(id);
    this.router.navigate(['/']);
  }
}
