/*
 * RERO ILS UI
 * Copyright (C) 2022-2024 RERO
 * Copyright (C) 2022-2023 UCLouvain
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

@Component({
  selector: 'admin-day-opening-hours',
  template: `
    <dl class="row my-0">
      <dt class="col-2">{{ day.day | translate }}</dt>
      <dd class="col-1 text-center">
        <i class="fa" [ngClass]="{
          'fa-times-circle-o text-danger': !day.is_open,
          'fa-circle text-success': day.is_open
        }"></i>
      </dd>
      <dd class="col">
        @if (day.is_open) {
          @for (time of day.times; track time) {
            <span class="period">{{ time.start_time }} - {{ time.end_time }}</span>
          }
        } @else {
          <span class="text-danger" translate>Closed</span>
        }
      </dd>
    </dl>
  `,
  styleUrls: ['./day-opening-hours.component.scss']
})
export class DayOpeningHoursComponent {
  @Input() day: any;
}
