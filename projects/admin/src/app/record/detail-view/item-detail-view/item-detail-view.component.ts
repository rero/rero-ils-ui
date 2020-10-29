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
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RecordService } from '@rero/ng-core';
import { DetailRecord } from '@rero/ng-core/lib/record/detail/view/detail-record';
import { Observable, Subscription } from 'rxjs';
import { IssueItemStatus, Item, ItemNote } from '../../../class/items';

@Component({
  selector: 'admin-item-detail-view',
  templateUrl: './item-detail-view.component.html',
  styles: []
})
export class ItemDetailViewComponent implements DetailRecord, OnInit, OnDestroy {

  /** Observable resolving record data */
  record$: Observable<any>;

  /** Record subscription */
  private _recordObs: Subscription;

  /** Resource type */
  type: string;

  /** Document record */
  record: any;

  /** Location record */
  location: any;

  /** reference to IssueItemStatus */
  issueItemStatus = IssueItemStatus;

  /**
   * Constructor
   * @param _recordService - RecordService
   */
  constructor(
    private _recordService: RecordService,
  ) {}

  ngOnInit() {
    this._recordObs = this.record$.subscribe( record => {
      this.record = record;
      this._recordService.getRecord('locations', record.metadata.location.pid, 1).subscribe(data => this.location = data);
    });
  }

  ngOnDestroy() {
    this._recordObs.unsubscribe();
  }

  isPublicNote(note: ItemNote): boolean {
    return Item.PUBLIC_NOTE_TYPES.includes(note.type);
  }
}
