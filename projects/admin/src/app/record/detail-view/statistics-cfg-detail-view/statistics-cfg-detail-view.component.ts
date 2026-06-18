// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { HttpClient } from "@angular/common/http";
import { Component, inject, input, signal, ChangeDetectionStrategy } from '@angular/core';
import { rxResource } from "@angular/core/rxjs-interop";
import { AppConfigService } from "@app/admin/service/app-config.service";
import { TranslateDirective, TranslatePipe } from "@ngx-translate/core";
import { NgClass, AsyncPipe } from "@angular/common";
import { Bind } from "primeng/bind";
import { Fieldset } from "primeng/fieldset";
import { Tabs, TabList, Tab, TabPanels, TabPanel } from "primeng/tabs";
import { Ripple } from "primeng/ripple";
import { ReportsListComponent } from "./reports-list/reports-list.component";
import { ReportDataComponent } from "./report-data/report-data.component";
import { DateTranslatePipe, GetRecordPipe, Nl2brPipe } from "@rero/ng-core";
import { Message } from "primeng/message";

@Component({
    selector: "admin-statistics-cfg-view",
    templateUrl: "./statistics-cfg-detail-view.component.html",
    imports: [TranslateDirective, NgClass, Bind, Fieldset, Tabs, TabList, Ripple, Tab, TabPanels, TabPanel, ReportsListComponent, ReportDataComponent, AsyncPipe, TranslatePipe, DateTranslatePipe, GetRecordPipe, Nl2brPipe, Message],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatisticsCfgDetailViewComponent {

  private httpClient = inject(HttpClient);
  private appConfigService = inject(AppConfigService);

  readonly record = input<any>();
  readonly type = input<string>('');

  private liveRequested = signal(false);

  readonly liveData = rxResource({
    params: () => this.liveRequested() ? this.record()?.metadata.pid : undefined,
    stream: ({ params: pid }) => {
      const baseUrl = this.appConfigService.apiEndpointPrefix;
      return this.httpClient.get<unknown[][]>(`${baseUrl}/stats_cfg/live/${pid}`);
    }
  });

  requestLiveValues(): void {
    this.liveRequested.set(true);
  }
}
