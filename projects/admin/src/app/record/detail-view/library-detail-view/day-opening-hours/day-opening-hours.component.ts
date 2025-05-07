/*
 * RERO ILS UI
 * Copyright (C) 2022-2025 RERO
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
    <dl class="metadata ui:mx-2">
      <dt>{{ day.day | translate }}</dt>
      <dd>
        <div class="ui:flex ui:gap-x-3 ui:items-center">
        <i class="fa" [ngClass]="{
          'fa-times-circle-o text-error': !day.is_open,
          'fa-circle text-success': day.is_open
        }"></i>
        @if (day.is_open) {
            @for (time of day.times; track $index; let last = $last) {
              <span>{{ time.start_time }} - {{ time.end_time }}</span>
              @if (!last) {
                /
              }
            }
        } @else {
          <span class="text-error" translate>Closed</span>
        }
        </div>
      </dd>
    </dl>
  `,
    standalone: false
})
export class DayOpeningHoursComponent {
  @Input() day: any;
}
