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
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AppConfigService } from "@app/admin/service/app-config.service";
import { TranslateService } from "@ngx-translate/core";
import { DetailRecord } from '@rero/ng-core/lib/record/detail/view/detail-record';
import { TabViewChangeEvent } from "primeng/tabview";
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: "admin-statistics-cfg-view",
  templateUrl: "./statistics-cfg-detail-view.component.html",
})
export class StatisticsCfgDetailViewComponent implements DetailRecord, OnInit, OnDestroy {

  private httpClient: HttpClient = inject(HttpClient);
  private appConfigService: AppConfigService = inject(AppConfigService);
  private translateService: TranslateService = inject(TranslateService);

  /** Observable resolving record data */
  record$: Observable<any>;

  /** Resource type */
  type: string;

  /** the api response record */
  record: any;

  // the current preview values
  liveData: any = null;

  // Error on data loading
  liveDataError: string = undefined;

  /** Subscription to (un)follow the record$ Observable */
  private subscriptions = new Subscription();

  /** OnInit hook */
  ngOnInit() {
    this.subscriptions = this.record$.subscribe((record) => {
      this.record = record;
    });
  }

  /** onDestroy hook */
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  /** Preview values corresponding to the current configuration. */
  getLiveValues(): void {
    // only once
    if (this.liveData != null) {
      return;
    }
    this.liveDataError = undefined;
    const { pid } = this.record.metadata;
    const baseUrl = this.appConfigService.apiEndpointPrefix;
    this.httpClient
      .get(`${baseUrl}/stats_cfg/live/${pid}`)
      .subscribe({
        next: (res) => (this.liveData = res),
        error: () => this.liveDataError = this.translateService.instant('Data loading error')
        });
  }

  /**
   * Handles the TabView change event to update live values.
   *
   * This method is called when the active tab in the TabView changes. If the new tab index is 1,
   * it triggers the `getLiveValues` method to refresh the data displayed in the application.
   *
   * @param {TabViewChangeEvent} event - The event object that contains details about the tab change.
   */
  tabViewChange(event: TabViewChangeEvent): void {
    if (event.index == 1) {
      this.getLiveValues();
    }
  }
}
