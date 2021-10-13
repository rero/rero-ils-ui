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
import { Component, Input } from '@angular/core';

@Component({
  selector: 'admin-day-opening-hours',
  template: `
    <dl class="row my-0">
      <dt class="col-2">{{ day.day | translate }}</dt>
      <dd class="col">
        <ng-container *ngIf="day.is_open; else closed">
          <span class="period" *ngFor="let time of day.times">{{ time.start_time }} - {{ time.end_time }}</span>
        </ng-container>
        <ng-template #closed>
          <span class="text-danger" translate>Closed</span>
        </ng-template>
      </dd>
    </dl>
  `,
  styleUrls: ['./day-opening-hours.component.scss']
})
export class DayOpeningHoursComponent {
  @Input() day: any;
}
