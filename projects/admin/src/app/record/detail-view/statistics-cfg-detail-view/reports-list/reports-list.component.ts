/*
 * RERO ILS UI
 * Copyright (C) 2023 RERO
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

import { Component, Input, OnInit } from "@angular/core";
import { ApiService, Record, RecordService } from "@rero/ng-core";
import { map } from "rxjs/operators";

@Component({
  selector: "admin-reports-list",
  templateUrl: "./reports-list.component.html",
})
export class ReportsListComponent implements OnInit {
  // persistent identifier of the current stat report configuration
  @Input() pid: any;

  // list of the corresponding reports from elasticsearch
  reports: Array<any>;

  /**
   * Constructor
   * @param _recordService - RecordService
   * @param _apiService - ApiService
   */
  constructor(
    private _recordService: RecordService,
    private _apiService: ApiService
  ) {}

  /**
   * Get the report item URL
   *
   * @param pid - Persistent Identifier value.
   * @returns the URL as string.
   */
  getReportUrl(pid: string): string {
    return `${this._apiService.getEndpointByType("stats")}/${pid}`;
  }

  /** OnInit hook */
  ngOnInit(): void {
    this._recordService
      .getRecords("stats", `config.pid:${this.pid}`, 1, 100)
      .pipe(
        map((result: Record) =>
          this._recordService.totalHits(result.hits.total) === 0
            ? []
            : result.hits.hits
        )
      ).subscribe((res: any) => (this.reports = res));
  }
}
