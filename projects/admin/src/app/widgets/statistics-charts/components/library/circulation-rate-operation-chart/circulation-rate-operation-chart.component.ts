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

import { Component, Input } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '@rero/shared';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseStatisticsChartComponent } from '../../common/base-statistics-chart.component';
import { CirculationRateOperationChartAdminComponent } from './admin/circulation-rate-operation-chart-admin.component';
import { LibraryStatisticsService } from '../../../services/library-statistics.service';
import { environment } from '../../../../../../environments/environment';
import _ from 'lodash';

@Component({
  selector: 'admin-stat-circulation-rate-operation-chart',
  templateUrl: './circulation-rate-operation-chart.component.html'
})
export class CirculationRateOperationChartComponent extends BaseStatisticsChartComponent {

  // COMPONENT ATTRIBUTES =====================================================
  /** the current logged user library pid */
  @Input() libraryPid: string;
  /** allow administration settings */
  @Input() administration = true;

  /** Setting used to display the component charts */
  staticSettings = {
    xAxis: true,
    yAxis: true,
    legendText: true,
    showXAxisLabel: false,
    showYAxisLabel: true,
    xAxisLabel: 'Timestamp',
    yAxisLabel: 'Operations',
    animations: true,
    legendTitle: 'Operations',
    colorScheme: environment.ngxChartsColorScheme,
  };
  settings: any = {
    autoRefreshDelay: 0,
    statisticsFilters: {
      from: 'now-7d',
      to: 'now',
      interval: '60',
      operation: ['checkout', 'checkin', 'extend', 'request']
    }
  };
  /** administration component modal reference */
  bsModalRef: BsModalRef;

  // CONSTRUCTOR & HOOKS ======================================================
  /**
   * Constructor
   * @param _userService - UserService
   * @param _statService - LibraryStatisticsService
   * @param _modalService - BsModalService
   * @param _translateService - TranslateService
   */
  constructor(
    private _userService: UserService,
    private _statService: LibraryStatisticsService,
    private _modalService: BsModalService,
    private _translateService: TranslateService
  ) {
    super();
  }

  // COMPONENT FUNCTIONS ======================================================
  /**
   * Handle click on administration button.
   * This will open a modal dialog form where user could specify settings to use to build this
   * statistics widget.
   */
  openAdministrationModal() {
    this.bsModalRef = this._modalService.show(
      CirculationRateOperationChartAdminComponent,
      { initialState: {settings: this.settings }}
    );
    this.bsModalRef.content.settingsEvent
      .subscribe(settings => {
        this.settings = settings ;
        this._enableAutoRefresh();
        this._getStatistics();
      }
    );
  }

  /** Return observable use to get statistics for this widget */
  protected loadStatistics(): Observable<any> {
    return this._statService
      .getCirculationRateStatistics(this.libraryPid, this.settings.statisticsFilters)
      .pipe(
        map((stats) => {
          stats.map((serie) => {
            // this.randomOperationSeries(serie.series);
            return serie;
          });
          return stats;
        })  // TODO :: remove sample data to debug
      )
  }

  /** TODO :: remove this function - only use for test/debug */
  private randomOperationSeries(series: {name: string, value: number}[]) {

    function getRandomArbitrary(min, max) {
      return Math.round(Math.random() * (max - min) + min);
    }

    series.map((entry) => {
      const tmp_value = getRandomArbitrary(-10, 10);
      entry.value = tmp_value > 0 ? tmp_value : 0;
      return entry;
    });
  }
}
