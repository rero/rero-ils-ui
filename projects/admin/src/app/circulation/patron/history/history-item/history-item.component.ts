/*
 * RERO ILS UI
 * Copyright (C) 2020 RERO
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

import { Component, Input, OnInit } from '@angular/core';
import { extractIdOnRef, RecordService } from '@rero/ng-core';
import { forkJoin } from 'rxjs';
import { ProvisionActivityType } from '../../../../pipe/provision-activity.pipe';
import { PatronService } from '../../../../service/patron.service';

@Component({
  selector: 'admin-history-item',
  templateUrl: './history-item.component.html'
})
export class HistoryItemComponent implements OnInit {

  /** loan to display */
  @Input() loan: any;

  /** Item linked to the loan */
  item: any;

  /** Document linked to the loan */
  document: any;

  /** is loading */
  isLoading = false;

  /** Is collapsed */
  isCollapsed = true;

  /** ProvisionActivityType reference */
  provisionActivityType = ProvisionActivityType;

  /**
   * Constructor
   * @param _recordService - RecordService
   * @param _patronService - PatronService
   */
  constructor(
    private _recordService: RecordService,
    private _patronService: PatronService
  ) { }

  /**
   * Component initialization.
   * Load additional informations related to the loan : item and document
   */
  ngOnInit() {
    if (this.loan) {
      this._recordService.getRecord('items', this.loan.metadata.item_pid.value).subscribe(
        (result) => {
          const documentId = extractIdOnRef(result.metadata.document.$ref);
          const itemObservable = this._patronService.getItem(result.metadata.barcode);
          const documentObservable = this._recordService.getRecord(
            'documents', documentId, 1,
            { Accept: 'application/rero+json, application/json'}
          );
          forkJoin([itemObservable, documentObservable]).subscribe(
            (results) => {
              this.item = results[0];
              this.document = results[1];
            }
          );
        });
    }
  }
}
