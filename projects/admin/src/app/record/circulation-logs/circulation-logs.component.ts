/*
 * RERO ILS UI
 * Copyright (C) 2021-2024 RERO
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
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { _ } from "@ngx-translate/core";
import { TranslateService } from '@ngx-translate/core';
import { Record } from '@rero/ng-core';
import { DateTime } from 'luxon';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable, Subscription } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { OperationLogsApiService } from '@rero/shared';

@Component({
    selector: 'admin-circulation-logs',
    templateUrl: './circulation-logs.component.html',
    standalone: false
})
export class CirculationLogsComponent implements OnInit, OnDestroy {

  private dynamicDialogConfig: DynamicDialogConfig = inject(DynamicDialogConfig);
  private dynamicDialogRef: DynamicDialogRef = inject(DynamicDialogRef);
  private operationLogsApiService: OperationLogsApiService = inject(OperationLogsApiService);
  private translateService: TranslateService = inject(TranslateService);

  // COMPONENT ATTRIBUTES =====================================================
  /** Resource pid */
  resourcePid: string;
  /** Resource type */
  resourceType: string;
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

  formGroup: FormGroup | undefined;

  filterTypes = ['loan', 'notif'];

  /** all component subscription */
  private subscriptions = new Subscription();

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
    return this.translateService.instant(linkText, { counter: count });
  }

  // HOOKS ======================================================
  /** OnInit hook */
  ngOnInit(): void {
    const { data } = this.dynamicDialogConfig;
    this.resourcePid = data.resourcePid;
    this.formGroup = new FormGroup(
      this.filterTypes.reduce((acc, elem) => {
        acc[elem] =  new FormControl<boolean>(undefined);
        return acc
      }, {})
    );
    this.resourceType = data.resourceType || 'item';
    this.subscriptions.add(
    this.formGroup.valueChanges.pipe(
      switchMap(res => this.circulationLogsQuery(1))
    ).subscribe((response: any) => {
      this.recordTotals = response.total.value;
      this.records = response.hits;
      this.loadedRecord = true;
    }));

    this.formGroup.setValue(this.filterTypes.reduce((acc, elem) => {
      acc[elem] = true
      return acc
    }, {}));
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  // PUBLIC FUNCTIONS =========================================================
  /** Close operation log dialog */
  closeDialog(): void {
    this.dynamicDialogRef.close();
  }

  /** show more */
  showMore(): void {
    this.page++;
    this.circulationLogsQuery(this.page)
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
  isSamePeriod(date1: any, date2: any, period: string = 'months'): boolean {
    if (date1 && date2) {
      const transDate1 = DateTime.fromISO(date1.metadata.date);
      const transDate2 = DateTime.fromISO(date2.metadata.date);
      return transDate1.hasSame(transDate2, period);
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

  // PRIVATE FUNCTIONS ========================================================
  /**
   * Circulation logs query
   * @param page - number
   * @return Observable
   */
  private circulationLogsQuery(page: number): Observable<any> {
    return this.operationLogsApiService
      .getCirculationLogs(this.resourceType, this.resourcePid, page, this.itemsPerPage, this.formGroup.value)
      .pipe(map((response: Record) =>  response.hits));
  }
}
