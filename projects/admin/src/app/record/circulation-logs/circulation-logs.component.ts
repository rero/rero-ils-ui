/*
 * RERO ILS UI
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
import { TranslateService } from '@ngx-translate/core';
import { Record } from '@rero/ng-core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { OperationLogsApiService } from '../../api/operation-logs-api.service';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';

@Component({
  selector: 'admin-circulation-logs',
  templateUrl: './circulation-logs.component.html',
  styleUrls: ['./circulation-logs.component.css']
})
export class CirculationLogsComponent implements OnInit {

  /** Resource pid */
  @Input() resourcePid: string;

  /** Current page */
  page = 1;

  /** items per pages */
  itemsPerPage = 10;

  /** Total of records */
  recordTotals = 0;

  /** Array of records */
  records = [];

  /** first loaded record */
  loadedRecord = false;

  /** Event on dialog close */
  dialogClose$ = new BehaviorSubject(false);

  /**
   * Show more link is visible
   * @return boolean
   */
  get isLinkShowMore(): boolean {
    return this.recordTotals > 0
      && ((this.page * this.itemsPerPage) < this.recordTotals);
  }

  /**
   * Hidden holdings count
   * @return string
   */
  get hiddenOperationLogs(): string {
    let count = this.recordTotals - (this.page * this.itemsPerPage);
    if (count < 0) { count = 0; }
    const linkText = (count > 1)
      ? _('{{ counter }} hidden circulations logs')
      : _('{{ counter }} hidden circulations log');
    return this._translateService.instant(linkText, { counter: count });
  }

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
   * Circulation logs query
   * @param page - number
   * @returns Obserable
   */
  private _circulationLogsQuery(page: number): Observable<any> {
    return this._operationLogsApiService.getCirculationLogs(this.resourcePid, page, this.itemsPerPage)
    .pipe(map((response: Record) =>  response.hits));
  }
}
