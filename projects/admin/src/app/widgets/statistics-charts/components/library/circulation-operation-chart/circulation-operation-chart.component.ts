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
import { UserService } from '@rero/shared';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../environments/environment';
import { BaseStatisticsChartComponent } from '../../common/base-statistics-chart.component';
import { LibraryStatisticsService } from '../../../services/library-statistics.service';
import { CirculationOperationChartAdminComponent } from './admin/circulation-operation-chart-admin.component';

@Component({
  selector: 'admin-stat-chart-library-circulation',
  templateUrl: './circulation-operation-chart.component.html'
})
export class CirculationOperationChartComponent extends BaseStatisticsChartComponent {
  // COMPONENT ATTRIBUTES =====================================================
  /** the current logged user library pid */
  @Input() libraryPid: string;
  @Input() administration = true;

  /** Setting used to display the component charts */
  staticSettings = {
    xAxis: true,
    yAxis: true,
    legendText: true,
    showXAxisLabel: false,
    showYAxisLabel: true,
    xAxisLabel: 'Dates',
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
      interval: '1h',
      operation: ['checkout', 'checkin', 'extend']
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
   */
  constructor(
    private _userService: UserService,
    private _statService: LibraryStatisticsService,
    private _modalService: BsModalService
  ) {
    super();
  }

  // PUBLIC COMPONENT FUNCTIONS ===============================================
  /**
   * Handle click on administration button.
   * This will open a modal dialog form where user could specify settings to use to build this
   * statistics widget.
   */
  openAdministrationModal() {
    this.bsModalRef = this._modalService.show(
      CirculationOperationChartAdminComponent,
      { initialState: {settings: this.settings }}
    );
    this.bsModalRef.content.settingsEvent
      .subscribe((settings) => {
        this.settings = settings;
        this._enableAutoRefresh();
        this._getStatistics();
      });
  }

  /** Return observable used to get statistics for this widget */
  loadStatistics(): Observable<any> {
    return this._statService
      .getCirculationStatistics(this.libraryPid, this.settings.statisticsFilters);
  }
}
