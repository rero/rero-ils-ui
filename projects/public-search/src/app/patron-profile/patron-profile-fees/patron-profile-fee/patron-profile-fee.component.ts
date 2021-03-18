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
import { Record } from '@rero/ng-core';
import { IOrganisation } from '@rero/shared/public-api';
import { PatronTransactionEventApiService } from '../../../api/patron-transaction-event-api.service';
import { PatronProfileMenuService } from '../../patron-profile-menu.service';

@Component({
  selector: 'public-search-patron-profile-fee',
  templateUrl: './patron-profile-fee.component.html',
  styleUrls: ['./patron-profile-fee.component.scss']
})
export class PatronProfileFeeComponent {

  /** Fee record */
  @Input() record: any;

  /** Detail collapsed */
  isCollapsed = true;

  /** Array of event records */
  events = [];

  /** loaded */
  private _loaded = false;

  get organisation(): IOrganisation {
    return this._patronProfileMenuService.currentPatron.organisation;
  }

  /**
   * Constructor
   * @param _patronTransactionEventApiService - PatronTransactionEventApiService
   * @param _patronProfileMenuService - PatronProfileMenuService
   */
  constructor(
    private _patronTransactionEventApiService: PatronTransactionEventApiService,
    private _patronProfileMenuService: PatronProfileMenuService
  ) {}

  /**
   * Expanded
   * @param feePid - string
   */
  expanded(feePid: string): void {
    if (!this._loaded) {
      this._patronTransactionEventApiService
        .getEvents(feePid).subscribe((response: Record) => {
          this._loaded = true;
          this.events = response.hits.hits;
        });
    }
  }
}
