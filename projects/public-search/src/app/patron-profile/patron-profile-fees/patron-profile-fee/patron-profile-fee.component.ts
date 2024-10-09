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
import { Component, inject, Input } from '@angular/core';
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

  private patronTransactionEventApiService: PatronTransactionEventApiService = inject(PatronTransactionEventApiService);
  private patronProfileMenuService: PatronProfileMenuService = inject(PatronProfileMenuService);

  /** Fee record */
  @Input() record: any;

  /** Detail collapsed */
  isCollapsed = true;

  /** Array of event records */
  events = [];

  /** loaded */
  private loaded = false;

  get organisation(): IOrganisation {
    return this.patronProfileMenuService.currentPatron.organisation;
  }

  /**
   * Expanded
   * @param feePid - string
   */
  expanded(feePid: string): void {
    if (!this.loaded) {
      this.patronTransactionEventApiService
        .getEvents(feePid).subscribe((response: Record) => {
          this.loaded = true;
          this.events = response.hits.hits;
        });
    }
  }
}
