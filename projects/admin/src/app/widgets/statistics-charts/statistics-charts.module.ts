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

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CirculationOperationChartAdminComponent } from
    './components/library/circulation-operation-chart/admin/circulation-operation-chart-admin.component';
import { CirculationOperationChartComponent } from
    './components/library/circulation-operation-chart/circulation-operation-chart.component';
import { DocumentTypesRepartitionChartsComponent } from
    './components/library/document-repartition-chart/document-repartition-chart.component';
import { CirculationRateOperationChartComponent } from
    './components/library/circulation-rate-operation-chart/circulation-rate-operation-chart.component';
import { CirculationRateOperationChartAdminComponent } from
    './components/library/circulation-rate-operation-chart/admin/circulation-rate-operation-chart-admin.component';
import { FormlyModule } from '@ngx-formly/core';
import { TranslateModule } from '@ngx-translate/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { StatisticsChartComponent } from './components/common/statistics-chart.component';


@NgModule({
  declarations: [
    StatisticsChartComponent,
    CirculationOperationChartComponent,
    CirculationOperationChartAdminComponent,
    CirculationRateOperationChartComponent,
    CirculationRateOperationChartAdminComponent,
    DocumentTypesRepartitionChartsComponent
  ],
  exports: [
    StatisticsChartComponent,
    CirculationOperationChartComponent,
    CirculationRateOperationChartComponent,
    DocumentTypesRepartitionChartsComponent
  ],
  imports: [
    CommonModule,
    FormlyModule,
    NgxChartsModule,
    ReactiveFormsModule,
    TranslateModule
  ]
})
export class StatisticsChartsModule { }
