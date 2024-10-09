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
import { ApiService } from "@rero/ng-core";
import { DetailRecord } from '@rero/ng-core/lib/record/detail/view/detail-record';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: "admin-statitics-cfg-view",
  templateUrl: "./statistics-cfg-detail-view.component.html",
})
export class StatisticsCfgDetailViewComponent implements DetailRecord, OnInit, OnDestroy {

  private httpClient: HttpClient = inject(HttpClient);
  private apiService: ApiService = inject(ApiService);

  /** Observable resolving record data */
  record$: Observable<any>;

  /** Resource type */
  type: string;

  /** the api response record */
  record: any;

  // the current preview values
  liveData: any = null;

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
    const { pid } = this.record.metadata;
    const baseUrl = this.apiService.endpointPrefix;
    this.httpClient
      .get(`${baseUrl}/stats_cfg/live/${pid}`)
      .subscribe((res) => (this.liveData = res));
  }
}
