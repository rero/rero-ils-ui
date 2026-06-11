/*
 * RERO ILS UI
 * Copyright (C) 2023-2024 RERO
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
import { Component, inject, input, ChangeDetectionStrategy } from "@angular/core";
import { rxResource } from "@angular/core/rxjs-interop";
import { ApiService, RecordService, DateTranslatePipe } from "@rero/ng-core";
import { map } from "rxjs/operators";
import { Bind } from "primeng/bind";
import { TableModule } from "primeng/table";
import { ButtonDirective } from "primeng/button";
import { TranslateDirective } from "@ngx-translate/core";

@Component({
    selector: "admin-reports-list",
    templateUrl: "./reports-list.component.html",
    imports: [Bind, TableModule, ButtonDirective, TranslateDirective, DateTranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportsListComponent {

  private recordService = inject(RecordService);
  private apiService = inject(ApiService);

  // persistent identifier of the current stat report configuration
  pid = input<string>();

  // list of the corresponding reports from elasticsearch
  reports = rxResource({
    params: () => this.pid(),
    stream: ({ params: pid }) =>
      this.recordService
        .getRecords("stats", { query: `config.pid:${pid}`, page: 1, itemsPerPage: 100 })
        .pipe(
          map((result) =>
            this.recordService.totalHits(result.hits.total) === 0
              ? []
              : result.hits.hits
          )
        )
  });

  /**
   * Get the report item URL
   *
   * @param pid - Persistent Identifier value.
   * @returns the URL as string.
   */
  getReportUrl(pid: string): string {
    return `${this.apiService.getEndpointByType("stats")}/${pid}`;
  }
}
