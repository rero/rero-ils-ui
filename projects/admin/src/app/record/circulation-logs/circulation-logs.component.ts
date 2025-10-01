/*
 * RERO ILS UI
 * Copyright (C) 2021-2025 RERO
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
import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { _, TranslateService } from "@ngx-translate/core";
import { Record } from '@rero/ng-core';
import { OperationLogsApiService } from '@rero/shared';
import { DateTime } from 'luxon';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

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

  /** Resource pid */
  resourcePid: string;
  /** Resource type */
  resourceType: string;
  /** Current page */
  page = signal<number>(1);
  /** items per pages */
  itemsPerPage = 10;
  /** Total of records */
  recordsTotal = signal<number>(0);
  /** Current highlighted loan */
  highlightedLoanPid: string = null;
  /** Array of records */
  records = signal<any[]>([]);
  /** first loaded record */
  loadedRecord = signal<boolean>(false);

  isLinkShowMore = computed(() => this.recordsTotal() !== this.records().length);

  hiddenTransactionLabel = computed(() => {
    const count = this.recordsTotal() - this.records().length;
    const linkText = (count > 1)
      ? _('{{ counter }} hidden circulations logs')
      : _('{{ counter }} hidden circulations log');
    return this.translateService.instant(linkText, { counter: count });
  });

  formGroup: FormGroup | undefined;

  filterTypes = ['loan', 'notif'];

  /** all component subscription */
  private subscriptions = new Subscription();

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
        switchMap(() => this.circulationLogsQuery(1))
      ).subscribe((response: Record) => {
        this.page.set(1);
        this.recordsTotal.set(response.hits.total.value);
        this.records.set(response.hits.hits);
        this.loadedRecord.set(true);
      })
    );

    this.formGroup.setValue(this.filterTypes.reduce((acc, elem) => {
      acc[elem] = true
      return acc
    }, {}));
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  /** Close operation log dialog */
  closeDialog(): void {
    this.dynamicDialogRef.close();
  }

  /** show more */
  showMore(): void {
    this.page.update(page => page + 1);
    this.circulationLogsQuery(this.page())
      .subscribe((response: Record) => {
        this.records.update(records => records.concat(response.hits.hits));
      });
  }

  /**
   * This function will check if two date are in the same time period
   * @param record1: the first record to check.
   * @param record2: the second record to check.
   * @param period: the time period to use to compare both dates
   * @return True if dates are similar, False otherwise
   */
  isSamePeriod(record1: any, record2: any, period = 'months'): boolean {
    if (record1 && record2) {
      const transDate1 = DateTime.fromISO(record1.metadata.date);
      const transDate2 = DateTime.fromISO(record2.metadata.date);
      return transDate1.hasSame(transDate2, period);
    }
    return true;
  }

  /**
   * Handler for mouse event
   * @param record: the record on which the event is triggered.
   */
  mouseEventTransaction(record: any): void {
    if (record?.metadata?.loan?.pid !== this.highlightedLoanPid) {
      this.highlightedLoanPid = record.metadata.loan.pid;
    }
  }

  /**
   * Circulation logs query
   * @param page - number
   */
  private circulationLogsQuery(page: number): Observable<any> {
    return this.operationLogsApiService
      .getCirculationLogs(this.resourceType, this.resourcePid, page, this.itemsPerPage, this.formGroup.value);
  }
}
