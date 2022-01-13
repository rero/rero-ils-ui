/*
 * RERO ILS UI
 * Copyright (C) 2022 RERO
 * Copyright (C) 2022 UCLouvain
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
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'admin-stat-chart',
  templateUrl: './statistics-chart.component.html',
  styleUrls: ['./statistics-chart.component.scss']
})
export class StatisticsChartComponent {
  @Input() title: string = null;
  @Input() administration = false;
  @Input() autoRefresh = false;
  @Input() autoRefreshDelay = 0;
  @Input() minHeight = 400;
  @Input() isRefreshing = false;
  @Input() error: Error = null;

  @Output() administrationActivate = new EventEmitter();
  @Output() isRefreshingChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  /** Is the autoRefresh settings allow chart refresh. */
  get autoRefreshEnabled(): boolean {
    return this.autoRefresh && this.autoRefreshDelay > 0;
  }
}
