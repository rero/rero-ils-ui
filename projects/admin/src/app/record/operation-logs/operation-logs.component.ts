/*
 * RERO ILS UI
 * Copyright (C) 2021-2024 RERO
 * Copyright (C) 2021-2023 UCLouvain
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
import { Component, inject, OnInit } from '@angular/core';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { NgCoreTranslateService, Record } from '@rero/ng-core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { forkJoin, Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { OperationLogsApiService } from '../../api/operation-logs-api.service';
import { OperationLogsService } from '../../service/operation-logs.service';

@Component({
  selector: 'admin-operation-logs',
  templateUrl: './operation-logs.component.html',
  styleUrls: ['./operation-logs.component.scss']
})
export class OperationLogsComponent implements OnInit {

  private dynamicDialogRef: DynamicDialogRef = inject(DynamicDialogRef);
  private dynamicDialogConfig: DynamicDialogConfig = inject(DynamicDialogConfig);
  private operationLogsApiService: OperationLogsApiService = inject(OperationLogsApiService);
  private operationLogService: OperationLogsService = inject(OperationLogsService);
  private translateService: NgCoreTranslateService = inject(NgCoreTranslateService);

  // COMPONENT ATTRIBUTES =====================================================
  /** Resource type */
  resourceType: string;
  /** Resource pid */
  resourcePid: string;
  /** Resource key */
  resourceKey: string;
  /** Current page */
  page = 1;
  /** items per pages */
  itemsPerPage = 5;
  /** Total of records */
  recordTotals = 0;
  /** Create record */
  createRecord: any;
  /** Array of records */
  records = [];
  /** first loaded record */
  loadedRecord = false;

  // GETTER & SETTER ==========================================================
  /** Show more link is visible ? */
  get isLinkShowMore(): boolean {
    return this.recordTotals > 0 && ((this.page * this.itemsPerPage) < this.recordTotals);
  }

  /** Hidden operation logs counter */
  get hiddenOperationLogs(): string {
    let count = this.recordTotals - (this.page * this.itemsPerPage);
    if (count < 0) { count = 0; }
    const linkText = (count > 1)
      ? _('{{ counter }} hidden operation logs')
      : _('{{ counter }} hidden operation log');
    return this.translateService.instant(linkText, { counter: count });
  }

  // HOOKS ======================================================
  /** OnInit hook */
  ngOnInit(): void {
    this.resourceType = this.dynamicDialogConfig?.data?.resourceType;
    this.resourcePid = this.dynamicDialogConfig?.data?.resourcePid;
    this.resourceKey = this.operationLogService.getResourceKeyByResourceName(this.resourceType);
    forkJoin([this._operationLogsQuery(1, 'create'), this._operationLogsQuery(1, 'update')])
      .pipe(
        finalize(() => this.loadedRecord = true)
      )
      .subscribe(
        ([createOpLogs, updateOpLogs]) => {
          this.createRecord = createOpLogs.hits.shift();
          this.recordTotals = updateOpLogs.total.value;
          this.records = this.records.concat(updateOpLogs.hits);
        }
      );
  }

  // COMPONENT FUNCTIONS ======================================================
  /** Close operation log dialog */
  closeDialog(): void {
    this.dynamicDialogRef.close();
  }

  /** show more */
  showMore(): void {
    this.page++;
    this._operationLogsQuery(this.page, 'update')
      .subscribe((response: any) => this.records = this.records.concat(response.hits));
  }

  // PRIVATE COMPONENT FUNCTIONS ==============================================
  /**
   * Operation logs query
   * @param page - number
   * @param action - string
   * @return Observable
   */
  private _operationLogsQuery(page: number, action: 'create' | 'update'): Observable<any> {
    return this.operationLogsApiService
      .getLogs(this.resourceKey, this.resourcePid, action, page, this.itemsPerPage)
      .pipe(map((response: Record) => response.hits));
  }
}
