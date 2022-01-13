/*
 * RERO ILS UI
 * Copyright (C) 2019-2023 RERO
 * Copyright (C) 2019-2023 UCLouvain
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

import { Component, OnDestroy, OnInit } from '@angular/core';
import { interval, Observable, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'admin-base-statistics-chart',
  template: `<div></div>`,
})
export abstract class BaseStatisticsChartComponent implements OnInit, OnDestroy {

  // COMPONENT ATTRIBUTES =====================================================
  /** Setting used to display the component charts */
  settings = {
    autoRefreshDelay: 0
  };
  /** Data used to draw the charts */
  series: any[] = [];
  /** is the data is refreshing ? */
  isRefreshing = false;
  /** possible error message */
  error: Error = null;

  /** the subscription to get statistics data */
  private _statisticsSubscription = new Subscription();
  /** the subscription for the interval refreshing */
  private _intervalSubscription = new Subscription();

  // GETTER & SETTER ==========================================================
  /** Is the autoRefresh settings allow chart refresh. */
  get autoRefreshEnabled(): boolean {
    return this.settings.hasOwnProperty('autoRefreshDelay') && this.settings.autoRefreshDelay > 0;
  }

  // CONSTRUCTOR & HOOKS ======================================================
  /** OnInit hook */
  ngOnInit(): void {
    this._getStatistics();
    this._enableAutoRefresh();
  }

  /** OnDestroy hook */
  ngOnDestroy() {
    if (this._intervalSubscription) {
      this._intervalSubscription.unsubscribe();
    }
    if (this._statisticsSubscription) {
      this._statisticsSubscription.unsubscribe();
    }
  }

  // ABSTRACT FUNCTIONS =======================================================
  /**
   * Function to load statistics data from source.
   * Should return the data formatted as the ngx-chart need to build the chart.
   */
  protected abstract loadStatistics(): Observable<any>;


  // COMPONENT FUNCTIONS ======================================================
  /** Enable the requested items auto-refresh behavior if needed */
  protected _enableAutoRefresh() {
    if (this._intervalSubscription) {
      this._intervalSubscription.unsubscribe();
      this._intervalSubscription = new Subscription();
    }
    if (this.settings.autoRefreshDelay > 0) {
      this._intervalSubscription = interval(this.settings.autoRefreshDelay).subscribe(() => this._getStatistics());
    }
  }

  /** Get the statistics for this widget */
  protected _getStatistics() {
    this.isRefreshing = true;
    if (this._statisticsSubscription){
      this._statisticsSubscription.unsubscribe();
    }
    this._statisticsSubscription = this.loadStatistics()
      .pipe(
        finalize(() => this.isRefreshing = false)
      )
      .subscribe(
        (stats) => this.series = stats,
        (error: Error) => {
          this.settings.autoRefreshDelay = 0; // disable auto-refresh to prevent multiple call
          this.error = error;
        }
      );
  }
}
