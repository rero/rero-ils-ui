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
