// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { AsyncPipe, NgClass } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, input, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { AppConfigService } from '@app/admin/service/app-config.service';
import { TranslatePipe } from '@ngx-translate/core';
import { Bind } from '@openng/optimus-ui/bind';
import { Fieldset } from '@openng/optimus-ui/fieldset';
import { Message } from '@openng/optimus-ui/message';
import { Ripple } from '@openng/optimus-ui/ripple';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@openng/optimus-ui/tabs';
import { DateTranslatePipe, GetRecordPipe, Nl2brPipe } from '@rero/ng-core';

import { ReportDataComponent } from './report-data/report-data.component';
import { ReportsListComponent } from './reports-list/reports-list.component';

@Component({
  selector: 'admin-statistics-cfg-view',
  templateUrl: './statistics-cfg-detail-view.component.html',
  imports: [
    NgClass,
    Bind,
    Fieldset,
    Tabs,
    TabList,
    Ripple,
    Tab,
    TabPanels,
    TabPanel,
    ReportsListComponent,
    ReportDataComponent,
    AsyncPipe,
    TranslatePipe,
    DateTranslatePipe,
    GetRecordPipe,
    Nl2brPipe,
    Message,
  ],
})
export class StatisticsCfgDetailViewComponent {
  private httpClient = inject(HttpClient);
  private appConfigService = inject(AppConfigService);

  readonly record = input<any>();
  readonly type = input<string>('');

  private liveRequested = signal(false);

  readonly liveData = rxResource({
    params: () => (this.liveRequested() ? this.record()?.metadata.pid : undefined),
    stream: ({ params: pid }) => {
      const baseUrl = this.appConfigService.apiEndpointPrefix;
      return this.httpClient.get<unknown[][]>(`${baseUrl}/stats_cfg/live/${pid}`);
    },
  });

  requestLiveValues(): void {
    this.liveRequested.set(true);
  }
}
