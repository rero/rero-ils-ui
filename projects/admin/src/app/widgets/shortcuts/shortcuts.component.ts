/*
 * RERO ILS UI
 * Copyright (C) 2020 RERO
 * Copyright (C) 2020 UCLouvain
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
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AllowIn, ShortcutEventOutput, ShortcutInput } from 'ng-keyboard-shortcuts';
import { User } from '../../class/user';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'admin-shortcuts',
  template: `<ng-keyboard-shortcuts [shortcuts]="shortcuts"></ng-keyboard-shortcuts>`
})
export class ShortcutsComponent implements OnInit, AfterViewInit {

  /** the current logged user */
  currentUser: User;

  /** shortcuts list */
  shortcuts: ShortcutInput[] = [];

  /** Constructor
   *  @param _router: Router
   *  @param _translateService: TranslateService
   *  @param _userService: UserService
   */
  constructor(
    private _router: Router,
    private _translateService: TranslateService,
    private _userService: UserService
  ) { }

  /** Hook OnInit */
  ngOnInit() {
    this._userService.onUserLoaded$.subscribe(() => this.currentUser = this._userService.getCurrentUser());
  }

  /** Hook AfterViewInit */
  ngAfterViewInit(): void {
    this.shortcuts.push(
      {
        key: ['escape'],
        label: this._translateService.instant('Global shortcuts'),
        description: this._translateService.instant('Lose focus on the current field'),
        allowIn: [AllowIn.Select, AllowIn.Input, AllowIn.Textarea],
        preventDefault: true,
        command: (output: ShortcutEventOutput) => (output.event.target as HTMLElement).blur()
      }, {
        key: ['/'],
        label: this._translateService.instant('Global shortcuts'),
        description: this._translateService.instant('Set focus on the header search input'),
        preventDefault: true,
        command: () => {
          const autocompleteElement = document.getElementsByClassName('rero-ils-autocomplete')[0];
          const inputField = autocompleteElement.getElementsByTagName('input')[0];
          inputField.focus();
        }
      }, {
        key: ['h'],
        label: this._translateService.instant('Global shortcuts'),
        description: this._translateService.instant('Open the global help page'),
        preventDefault: true,
        command: () => window.open('https://ils.test.rero.ch/help', 'rero-ils-help')
      }, {
        key: ['s'],
        label: this._translateService.instant('Global shortcuts'),
        description: this._translateService.instant('Switch to public interface'),
        command: () => {
          if (this.currentUser != null) {
            window.location.href = `/${this.currentUser.library.organisation.code}`;
          }
        }
      }, {
        key: ['p'],
        label: this._translateService.instant('Global shortcuts'),
        description: this._translateService.instant('Open the patron search page'),
        preventDefault: true,
        command: () => this._router.navigate(['/records', 'patrons'])
      }, {
        key: ['c'],
        label: this._translateService.instant('Global shortcuts'),
        description: this._translateService.instant('Open the circulation checkin interface'),
        preventDefault: false,
        command: () => this._router.navigate(['/circulation', 'checkout'])
      }, {
        key: ['r'],
        label: this._translateService.instant('Global shortcuts'),
        description: this._translateService.instant('Open the requests page'),
        preventDefault: true,
        command: () => this._router.navigate(['/circulation', 'requests'])
      }
    );
  }
}
