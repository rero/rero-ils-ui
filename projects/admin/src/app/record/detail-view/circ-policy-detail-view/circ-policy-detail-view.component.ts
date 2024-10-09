/*
 * RERO ILS UI
 * Copyright (C) 2019-2024 RERO
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

import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { OrganisationService } from '../../../service/organisation.service';

@Component({
  selector: 'admin-circ-policy-detail-view',
  templateUrl: './circ-policy-detail-view.component.html'
})

export class CircPolicyDetailViewComponent implements OnInit, OnDestroy {

  private organisationService: OrganisationService = inject(OrganisationService);

  // COMPONENT ATTRIBUTES ======================================================
  /** The observable resolving record data */
  record$: Observable<any>;
  /** The resource type */
  type: string;
  /** The record */
  record: any;
  /** Reminders */
  reminders = [];
  /** Overdues */
  overdues = [];
  /** The settings to display, patron type pid as a key */
  settings = new Map<string, string[]>();
  /** The list of item types concerned by the circulation policy */
  itemTypes = new Set();

  /** The observer to the record observable */
  private _recordObs = null;

  // GETTER & SETTER ==========================================================
  /** Organisation currency */
  get org_currency() {
    return this.organisationService.organisation.default_currency;
  }

  /** checkout is allowed ? */
  get checkoutIsAllowed() {
    return this.record && this.record.metadata.hasOwnProperty('checkout_duration');
  }

  /** On init hook */
  ngOnInit() {
    this._recordObs = this.record$.subscribe(record => {
      this.record = record;
      if (record.metadata.settings) {
        record.metadata.settings.forEach(setting => {
          // create new entry
          if (!this.settings.has(setting.patron_type.pid)) {
            this.settings.set(setting.patron_type.pid, [setting.item_type.pid]);
          } else {
            // append
            this.settings.get(setting.patron_type.pid).push(setting.item_type.pid);
          }
          // add item type to the list
          if (!this.itemTypes.has(setting.item_type.pid)) {
            this.itemTypes.add(setting.item_type.pid);
          }
        });
      }

      // sort reminders to ensure a better display
      if (record.metadata.reminders) {
        this.reminders = record.metadata.reminders
        .sort((a: any, b: any) => {
          return (a.type > b.type)
            ? 1
            : a.days_delay - b.days_delay;
          }
        );
      }
      // sort incremental overdue intervals
      if (record.metadata.overdue_fees && record.metadata.overdue_fees.intervals) {
        this.overdues = record.metadata.overdue_fees.intervals
          .sort((a: any, b: any) => a.from - b.from);
      }
    });
  }

  /** On destroy hook */
  ngOnDestroy() {
    this._recordObs.unsubscribe();
  }
}
