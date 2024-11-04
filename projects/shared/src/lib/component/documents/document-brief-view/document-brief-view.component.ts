/*
 * RERO ILS UI
 * Copyright (C) 2023 RERO
 * Copyright (C) 2023 UCLouvain
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

@Component({
  selector: 'shared-document-brief-view',
  templateUrl: './document-brief-view.component.html'
})
export class DocumentBriefViewComponent {

  /** Record */
  @Input() set record(record) {
    this._record = record;
    this.processProvisionActivityPublications();
  }

  /** Provision activities */
  provisionActivityPublications: any[] = [];

  /** Record */
  private _record: any;

  /** Get current record */
  get record(): any {
    return this._record;
  }

  /** process provision activity publications */
  private processProvisionActivityPublications() {
    if (this.record?.provisionActivity) {
      this.record.provisionActivity.forEach(provision => {
        if (provision.type === 'bf:Publication' && '_text' in provision) {
          this.provisionActivityPublications.push(...provision._text.map(text => text.value));
        }
      });
    }
  }
}
