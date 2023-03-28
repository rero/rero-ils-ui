/*
 * RERO ILS UI
 * Copyright (C) 2021-2023 RERO
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
import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Record } from '@rero/ng-core';
import moment from 'moment';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { OperationLogsApiService } from '../../api/operation-logs-api.service';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';

@Component({
  selector: 'admin-circulation-logs',
  templateUrl: './circulation-logs.component.html',
  styleUrls: ['./circulation-logs.component.scss']
})
export class CirculationLogsComponent implements OnInit {

  // COMPONENT ATTRIBUTES =====================================================
  /** Resource pid */
  @Input() resourcePid: string;
  /** Resource type */
  @Input() resourceType = 'item';

  /** Current page */
  page = 1;
  /** items per pages */
  itemsPerPage = 10;
  /** Total of records */
  recordTotals = 0;
  /** Current highlighted loan */
  highlightedLoanPid: string = null;
  /** Array of records */
  records = [];
  /** first loaded record */
  loadedRecord = false;
  /** Event on dialog close */
  dialogClose$ = new BehaviorSubject(false);
  /** Types of operation history (field: record.type) */
  filterTypes = {
    'loan': true,
    'notif': true
  }

  // GETTER & SETTER ==========================================================
  /**
   * Is the "show more" link should be visible
   * @return True if the link must be visible, False otherwise
   */
  get isLinkShowMore(): boolean {
    return this.recordTotals > 0
      && ((this.page * this.itemsPerPage) < this.recordTotals);
  }

  /**
   * Get the label to use for the hidden transaction logs string.
   * @return the translated string to display
   */
  get hiddenTransactionLabel(): string {
    let count = this.recordTotals - (this.page * this.itemsPerPage);
    count = (count < 0) ? 0 : count;
    const linkText = (count > 1)
      ? _('{{ counter }} hidden circulations logs')
      : _('{{ counter }} hidden circulations log');
    return this._translateService.instant(linkText, { counter: count });
  }

  // CONSTRUCTOR & HOOKS ======================================================
  /**
   * Constructor
   * @param _operationLogsApiService - OperationLogsApiService
   * @param _translateService - TranslateService
   */
  constructor(
    private _operationLogsApiService: OperationLogsApiService,
    private _translateService: TranslateService
  ) {}

  /** OnInit hook */
  ngOnInit(): void {
    this._circulationLogsQuery(1).subscribe((response: any) => {
      this.recordTotals = response.total.value;
      this.records = response.hits;
      this.loadedRecord = true;
    });
  }

  // PUBLIC FUNCTIONS =========================================================
  /** Close operation log dialog */
  closeDialog(): void {
    this.dialogClose$.next(true);
  }

  /** show more */
  showMore(): void {
    this.page++;
    this._circulationLogsQuery(this.page)
      .subscribe((response: any) => {
        this.records = this.records.concat(response.hits);
      });
  }

  /**
   * This function will check if two date are in the same time period
   * @param date1: the first date to check.
   * @param date2: the second date to check.
   * @param period: the time period to use to compare both dates
   * @return True if dates are similar, False otherwise
   */
  isSamePeriod(date1: any, date2: any, period: string = 'month'): boolean {
    if (date1 && date2) {
      const transDate1 = moment(date1.metadata.date);
      const transDate2 = moment(date2.metadata.date);
      return transDate1.isSame(transDate2, period);
    }
    return true;
  }

  /**
   * Handler for mouse event
   * @param record: the record on which the event is triggered.
   * @param event: the triggered event.
   */
  mouseEventTransaction(record: any, event: Event): void {
    if (record.metadata
        && record.metadata.loan
        && record.metadata.loan.pid
        && record.metadata.loan.pid !== this.highlightedLoanPid) {
      this.highlightedLoanPid = record.metadata.loan.pid;
    }
  }

  /**
   * Get Record Type
   * @param record - the record to determine the type
   * @returns string, the record type
   */
  getRecordType(record: any): string {
    switch(record.metadata.record.type) {
      case 'notif':
        return 'notification';
      default:
        return 'circulation';
    }
  }

  /**
   * Filter check
   * Allows you to add filters for a selection of records.
   * @param type - string (Filter key)
   */
  filterCheck(type: string): void {
    this.filterTypes[type] = !this.filterTypes[type];
    this._circulationLogsQuery(1).subscribe((response: any) => {
      this.recordTotals = response.total.value;
      this.records = response.hits;
      this.loadedRecord = true;
    });
  }

  // PRIVATE FUNCTIONS ========================================================
  /**
   * Circulation logs query
   * @param page - number
   * @return Observable
   */
  private _circulationLogsQuery(page: number): Observable<any> {
    return this._operationLogsApiService
      .getCirculationLogs(this.resourceType, this.resourcePid, page, this.itemsPerPage, this.filterTypes)
      .pipe(map((response: Record) =>  response.hits));
  }
}
