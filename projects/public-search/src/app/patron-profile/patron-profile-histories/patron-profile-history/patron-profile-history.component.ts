/*
 * RERO ILS UI
 * Copyright (C) 2021 RERO
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
import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PatronProfileMenuService } from '../../patron-profile-menu.service';

@Component({
  selector: 'public-search-patron-profile-history',
  templateUrl: './patron-profile-history.component.html',
  styleUrls: ['./patron-profile-history.component.scss']
})
export class PatronProfileHistoryComponent {

  /** Loan record */
  @Input() record: any;

  /** Document section is collapsed */
  isCollapsed = true;

  /** Get current viewcode */
  get viewcode(): string {
    return this._patronProfileMenuService.currentPatron.organisation.code;
  }

  /** Get current language */
  get language(): string {
    return this._translateService.currentLang;
  }

  /**
   * Constructor
   * @param _translateService - TranslateService
   * @param _patronProfileMenuService - PatronProfileMenuService
   */
  constructor(
    private _translateService: TranslateService,
    private _patronProfileMenuService: PatronProfileMenuService
  ) {}
}
