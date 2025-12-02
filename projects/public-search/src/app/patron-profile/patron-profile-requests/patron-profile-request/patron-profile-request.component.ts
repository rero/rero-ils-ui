/*
 * RERO ILS UI
 * Copyright (C) 2021-2025 RERO
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
import { PatronProfileMenuStore } from '../../store/patron-profile-menu-store';
import { RequestsStore } from '../../store/requests-store';

@Component({
  selector: 'public-search-patron-profile-request',
  templateUrl: './patron-profile-request.component.html',
  standalone: false
})
export class PatronProfileRequestComponent {

  private requestsStore = inject(RequestsStore);
  private patronProfileMenuStore = inject(PatronProfileMenuStore);

  /** Request record */
  @Input() record: any;

  /** Document section is collapsed */
  isCollapsed = true;

  /** Cancel in progress */
  cancelInProgress = this.requestsStore.cancelInProgress;

  /** Get current viewcode */
  get viewcode(): string {
    const patron = this.patronProfileMenuStore.currentPatron();
    return patron ? patron.organisation.code : '';
  }

  /** Cancel a request */
  cancel(): void {
    const patron = this.patronProfileMenuStore.currentPatron();
    if (patron) {
      this.requestsStore.cancelRequest({
        pid: this.record.metadata.pid,
        transactionLocationPid: this.record.metadata.item.location.pid,
        transactionUserPid: patron.pid
      });
    }
  }
}
