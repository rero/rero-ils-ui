// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
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
