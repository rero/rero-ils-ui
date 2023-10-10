/*
 * RERO ILS UI
 * Copyright (C) 2020-2023 RERO
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
import { Injectable } from '@angular/core';
import { PRIMARY_OUTLET, Router } from '@angular/router';
import { AppConfigService } from '@app/admin/service/app-config.service';
import { TranslateService } from '@ngx-translate/core';
import { DialogService, MenuItem } from '@rero/ng-core';
import { UserService } from '@rero/shared';
import { Observable } from 'rxjs';
import { LibrarySwitchService } from './library-switch.service';

@Injectable({
  providedIn: 'root'
})
export class LibrarySwitchMenuEventService {

  /**
   * Constructor
   * @param _userService - UserService
   * @param _router - Router
   * @param _appConfigService - AppConfigService
   * @param _dialogService - DialogService
   * @param _translateService - TranslateService
   * @param _librarySwitchService - LibrarySwitchService
   */
  constructor(
    private _userService: UserService,
    private _router: Router,
    private _appConfigService: AppConfigService,
    private _dialogService: DialogService,
    private _translateService: TranslateService,
    private _librarySwitchService: LibrarySwitchService,
  ) {}

  /**
   * Event on menu click
   * @param event - MenuItem
   */
  eventMenuClick(event: MenuItem): void {
    if (this._userService.user.currentLibrary !== event.getExtra('id')) {
      const url = this._router.url;
      const urlTree = this._router.parseUrl(url);
      const children = urlTree.root.children[PRIMARY_OUTLET];
      if (children) {
        const urlParams = children.segments.map(segment => segment.path);
        if (
          this._appConfigService.librarySwitchCheckParamsUrl
            .some(param => urlParams.includes(param))
        ) {
          this._dialog().subscribe((confirmation: boolean) => {
            if (confirmation) {
              this._switchAndNavigate(event.getExtra('id'));
            }
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
   * Dialog configuration
   * @return Observable
   */
  private _dialog(): Observable<boolean> {
    return this._dialogService.show({
      ignoreBackdropClick: false,
      initialState: {
        title: this._translateService.instant('Quit the page'),
        body: this._translateService.instant(
          'Do you want to quit the page? The changes made so far will be lost.'
        ),
        confirmButton: true,
        confirmTitleButton: this._translateService.instant('Quit'),
        cancelTitleButton: this._translateService.instant('Stay')
      }
    });
  }

  /**
   * Switch and navigate
   * @param id - string, library pid
   */
  private _switchAndNavigate(id: string): void {
    this._librarySwitchService.switch(id);
    this._router.navigate(['/']);
  }
}
