// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Component, inject, input } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { TranslatePipe } from '@ngx-translate/core';
import { Bind } from '@openng/optimus-ui/bind';
import { ButtonDirective } from '@openng/optimus-ui/button';
import { TableModule } from '@openng/optimus-ui/table';
import { ApiService, DateTranslatePipe, RecordService } from '@rero/ng-core';
import { map } from 'rxjs/operators';

@Component({
  selector: 'admin-reports-list',
  templateUrl: './reports-list.component.html',
  imports: [Bind, TableModule, ButtonDirective, TranslatePipe, DateTranslatePipe],
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
        .getRecords('stats', { query: `config.pid:${pid}`, page: 1, itemsPerPage: 100 })
        .pipe(map((result) => (result.hits.total === 0 ? [] : result.hits.hits))),
  });

  /**
   * Get the report item URL
   *
   * @param pid - Persistent Identifier value.
   * @returns the URL as string.
   */
  getReportUrl(pid: string): string {
    return `${this.apiService.getEndpointByType('stats')}/${pid}`;
  }
}
