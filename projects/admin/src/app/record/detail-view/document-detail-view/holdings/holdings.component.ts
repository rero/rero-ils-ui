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

import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { RecordService, RecordUiService } from '@rero/ng-core';
import { Record } from '@rero/ng-core/lib/record/record';
import { UserService } from '@rero/shared';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { RecordPermissionService } from '../../../../service/record-permission.service';

@Component({
  selector: 'admin-holdings',
  templateUrl: './holdings.component.html'
})
export class HoldingsComponent implements OnInit {
  /** Document */
  @Input() document: any;

  /** Holdings total */
  holdingsTotal = 0;

  /** Holdings per page */
  private holdingsPerPage = 5;

  /** Current page */
  page = 1;

  /** query */
  query: string;

  /** Holdings */
  holdings: any[];

  /** Holding type related to the parent document. */
  @Input() holdingType: 'electronic' | 'serial' | 'standard';

  /** Can a new holding be added? */
  canAdd = false;

  /**
   * Is link show more
   * @return boolean
   */
  get isLinkShowMore(): boolean {
    return this.holdingsTotal > 0
      && ((this.page * this.holdingsPerPage) < this.holdingsTotal);
  }

  /**
   * Hidden holdings count
   * @return string
   */
  get hiddenHoldings(): string {
    let count = this.holdingsTotal - (this.page * this.holdingsPerPage);
    if (count < 0) {
      count = 0;
    }
    const linkText = (count > 1)
      ? '{{ counter }} hidden holdings'
      : '{{ counter }} hidden holding';
    const linkTextTranslate = this._translateService.instant(linkText);
    return linkTextTranslate.replace('{{ counter }}', count);
  }

  /**
   * Constructor
   * @param _userService - UserService
   * @param _recordService - RecordService
   * @param _recordUiService - RecordUiService
   * @param _recordPermissionService - RecordPermissionService
   * @param _translateService - TranslateService
   */
  constructor(
    private _userService: UserService,
    private _recordService: RecordService,
    private _recordUiService: RecordUiService,
    private _recordPermissionService: RecordPermissionService,
    private _translateService: TranslateService
  ) { }

  /** onInit hook */
  ngOnInit() {
    this.canAdd = (!('harvested' in this.document.metadata));
    const orgPid = this._userService.user.currentOrganisation;
    this.query = `document.pid:${this.document.metadata.pid} AND organisation.pid:${orgPid}
    AND ((holdings_type:standard AND items_count:[1 TO *]) OR holdings_type:serial)`;
    const holdingsRecords = this._holdingsQuery(1, this.query);
    const holdingsCount = this._holdingsCountQuery(this.query);
    const permissionsRef = this._recordPermissionService.getPermission('holdings');
    forkJoin([holdingsRecords, holdingsCount, permissionsRef])
      .subscribe((result: [any[], number, any]) => {
        this.holdings = result[0];
        this.holdingsTotal = result[1];
        const permissions = result[2];
        this.canAdd = this.canAdd && permissions.create.can;
      });
  }

  /** Show more */
  showMore() {
    this.page++;
    this._holdingsQuery(this.page, this.query).subscribe((holdings: any[]) => {
      this.holdings = this.holdings.concat(holdings);
    });
  }

  /**
   * Delete a given holding.
   * @param data: object with 2 keys :
   *          * 'holding' : the holding to delete
   *          * 'callBackend' : boolean if backend API should be called
   */
  deleteHolding(data: { holding: any, callBackend: boolean }) {
    const holding = data.holding;
    if (data.callBackend === false) {
      this.holdings = this.holdings.filter(
        h => h.metadata.pid !== holding.metadata.pid
      );
    } else {
      this._recordUiService.deleteRecord('holdings', holding.metadata.pid)
        .subscribe((success: any) => {
          if (success) {
            this.holdings = this.holdings.filter(
              h => h.metadata.pid !== holding.metadata.pid
            );
          }
        });
    }
  }

  /**
   * Holdings count query
   * @param query - string
   * @return Observable
   */
  private _holdingsCountQuery(query: string) {
    return this._recordService.getRecords(
      'holdings', query, 1, 1,
      undefined, undefined, undefined, 'library_location'
    ).pipe(
      map((holdings: Record) => this._recordService.totalHits(holdings.hits.total))
    );
  }

  /**
   * Return a selected Holdings record
   * @param page - number
   * @param query - string
   * @return Observable
   */
  private _holdingsQuery(page: number, query: string) {
    return this._recordService.getRecords(
      'holdings', query, page, this.holdingsPerPage,
      undefined, undefined, {Accept: 'application/rero+json'}, 'library_location'
    ).pipe(map((holdings: Record) => {
      return holdings.hits.hits;
    }));
  }
}
