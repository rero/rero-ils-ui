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

@Component({
  selector: 'public-search-patron-profile-ill-request',
  templateUrl: './patron-profile-ill-request.component.html',
  styleUrls: ['./patron-profile-ill-request.component.scss']
})
export class PatronProfileIllRequestComponent {

  /** Ill record */
  @Input() record: any;

  /** Detail collapsed */
  isCollapsed = true;

  /**
   * Constructor
   * @param _translateService - TranslateService
   */
  constructor(private _translateService: TranslateService) {}

  /**
   * Badge for the current status
   * @param status - string
   * @return string - class for current status
   */
  statusBadge(status: string): string {
    switch (status) {
      case 'pending':
        return 'badge-secondary';
      case 'validated':
        return 'badge-success';
      case 'denied':
        return 'badge-danger';
      default:
        return 'badge-light';
    }
  }

  /**
   * Badge for the current loan status
   * @param status - string
   * @return string - class for current loan status
   */
  loanStatusBadge(status: string): string {
    switch (status) {
      case 'PENDING':
        return 'badge-warning';
      case 'ITEM_AT_DESK':
        return 'badge-success';
      case 'ITEM_ON_LOAN':
        return 'badge-info';
      default:
        return 'badge-light';
    }
  }

  /**
   * Journal volume and number
   * @param journal - Object with volume and number
   * @param string - formatted string for volume and number
   */
  journalVolume(journal: { volume?: string, number?: string }): string {
    const volume = [];
    if ('volume' in journal) {
      volume.push(this._translateService.instant(
        'Vol. {{ volume }}', { volume: journal.volume }
      ));
    }
    if ('number' in journal) {
      volume.push(this._translateService.instant(
        'n°. {{ number }}', { number: journal.number }
      ));
    }
    return volume.join(' -- ');
  }
}
