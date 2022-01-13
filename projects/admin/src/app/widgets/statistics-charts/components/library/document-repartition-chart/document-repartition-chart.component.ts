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
import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '@rero/shared';
import { LegendPosition } from '@swimlane/ngx-charts';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../environments/environment';
import { BaseStatisticsChartComponent } from '@app/admin/widgets/statistics-charts/components/common/base-statistics-chart.component';
import { LibraryStatisticsService } from '@app/admin/widgets/statistics-charts/services/library-statistics.service';

@Component({
  selector: 'admin-stat-chart-library-document-type-repartition',
  templateUrl: './document-repartition-chart.component.html'
})
export class DocumentTypesRepartitionChartsComponent extends BaseStatisticsChartComponent {

  // COMPONENT ATTRIBUTES =====================================================
  /** the current logged user library pid */
  @Input() libraryPid: string;
  /** allow administration settings */
  @Input() administration = false;

  /** Setting used to display the component charts */
  staticSettings = {
    labels: true,
    showLabels: true,
    showLegend: false,
    legendPosition: LegendPosition.Right,  // right | below
    legendTitle: 'Document type',
    animations: true,
    doughnut: true,
    arcWidth: 0.6,
    colorScheme: environment.ngxChartsColorScheme
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
  /** Get the statistics for this widget */
  protected loadStatistics(): Observable<any> {
    return this._statService.getDocTypeRepartitionStatistics(this.libraryPid);
  }

}
