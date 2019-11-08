/*
 * RERO ILS UI
 * Copyright (C) 2019 RERO
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

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'admin-circ-policy-detail-view',
  templateUrl: './circ-policy-detail-view.component.html'
})

export class CircPolicyDetailViewComponent implements OnInit, OnDestroy {

  /** The observable resolving record data */
  record$: Observable<any>;

  /** The resource type */
  type: string;

  /** The record */
  record: any;

  /** The settings to display */
  settings = new Map<string, string[]>();

  /** The observer to the record observable */
  private recordObs = null;

  /** On init hook */
  ngOnInit() {
    this.recordObs = this.record$.subscribe(record => {
      this.record = record;
      if (record.metadata.settings) {
        record.metadata.settings.forEach(setting => {
          if (!this.settings.has(setting.patron_type.pid)) {
            this.settings.set(setting.patron_type.pid, [setting.item_type.pid]);
          } else {
            this.settings.get(setting.patron_type.pid).push(setting.item_type.pid);
          }
        });
      }
    });
  }


  /** On destroy hook */
  ngOnDestroy() { this.recordObs.unsubscribe(); }
}
