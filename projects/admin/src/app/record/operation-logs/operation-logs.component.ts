/*
 * RERO ILS UI
 * Copyright (C) 2021 UCLouvain
 * Copyright (C) 2021 RERO
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
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { TranslateService } from '@ngx-translate/core';
import { Record } from '@rero/ng-core';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { OperationLogsApiService } from '../../api/operation-logs-api.service';
import { OperationLogsService } from '../../service/operation-logs.service';

@Component({
  selector: 'admin-operation-logs',
  templateUrl: './operation-logs.component.html',
  styleUrls: ['./operation-logs.component.scss']
})
export class OperationLogsComponent implements OnInit {

  // COMPONENT ATTRIBUTES =====================================================
  /** Resource type */
  @Input() resourceType: string;
  /** Resource pid */
  @Input() resourcePid: string;

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
  /** Event on dialog close */
  dialogClose$ = new BehaviorSubject(false);

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
    return this._translateService.instant(linkText, { counter: count });
  }

  // CONSTRUCTOR & HOOKS ======================================================
  /**
   * Constructor
   * @param _operationLogsApiService - OperationLogsApiService
   * @param _operationLogService - OperationLogsService
   * @param _translateService - TranslateService
   */
  constructor(
    private _operationLogsApiService: OperationLogsApiService,
    private _operationLogService: OperationLogsService,
    private _translateService: TranslateService
  ) {}

  /** OnInit hook */
  ngOnInit(): void {
    this.resourceKey = this._operationLogService.getResourceKeyByResourceName(this.resourceType);
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
    this.dialogClose$.next(true);
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
    return this._operationLogsApiService
      .getLogs(this.resourceKey, this.resourcePid, action, page, this.itemsPerPage)
      .pipe(map((response: Record) => response.hits));
  }
}
