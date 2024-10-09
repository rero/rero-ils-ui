/*
 * RERO ILS UI
 * Copyright (C) 2021-2024 RERO
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
import { IPatron, UserService } from '@rero/shared';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PatronProfileMenuService {

  private userService: UserService = inject(UserService);

  /** On change Observable */
  private _onChange: Subject<IMenu> = new Subject();

  /** Menu */
  private _menu = [];

  /** Current menu */
  private _currentMenu: IMenu;

  /** All available patrons */
  private _patrons: IPatron[];

  /** Current patron */
  private _currentPatron: IPatron;

  /**
   * On change
   * @return Observable
   */
  get onChange$(): Observable<IMenu> {
    return this._onChange.asObservable();
  }

  /**
   * Get menu
   * @return array of IMenu
   */
  get menu(): IMenu[] {
    return this._menu;
  }

  /**
   * Get current menu
   * @return IMenu
   */
  get currentMenu(): IMenu {
    return this._currentMenu;
  }

  /**
   * Get current patron
   * @return IPatron
   */
  get currentPatron(): IPatron {
    return this._currentPatron;
  }

  /**
   * Is multiple organisation
   * @return boolea
   */
  get isMultiOrganisation(): boolean {
    return this._patrons.length > 1;
  }

  /** OnInit hook */
  init(): void {
    const { user } = this.userService;
    if (user.isAuthenticated) {
      this._patrons = user.patrons.filter((patron) => patron.roles.includes('patron'));
      this._currentPatron = this._patrons[0];
      this._patrons.forEach((patron: IPatron) =>
        this._menu.push({ value: patron.pid, name: patron.organisation.name })
      );
      this._currentMenu = this._menu[0];
      this._onChange.next(this._menu[0]);
    }
  }

  /** Change */
  change(patronPid: string): void {
    this._currentPatron = this._patrons.filter((patron: IPatron) => patron.pid === patronPid)[0];
    this._currentMenu = this._menu.filter((line: IMenu) => line.value === patronPid)[0];
    this._onChange.next(this._currentMenu);
  }
}

export interface IMenu {
  value: string;
  name: string;
  selected?: boolean;
}
