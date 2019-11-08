/*
 * RERO ILS UI
 * Copyright (C) 2019 RERO
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
import { ResultItem } from '@rero/ng-core';

@Component({
  selector: 'admin-persons-brief-view',
  template: `
  <h5 class="card-title mb-0 rero-ils-person">
    <a [routerLink]="[detailUrl.link]" class="pr-1">{{ record.metadata | mefTitle }}</a>
    <ng-container *ngFor="let source of record.metadata.sources">
    <small class="badge badge-secondary ml-1">{{ source | uppercase }}</small>
    </ng-container>
  </h5>
  <div class="card-text px-2">
    <p class="mb-0" *ngIf="record.metadata | birthDate">{{ record.metadata | birthDate }}</p>
    <p class="mb-0" *ngIf="record.metadata | bioInformations">{{ record.metadata | bioInformations }}</p>
  </div>
  `,
  styles: []
})
export class PersonsBriefViewComponent implements ResultItem {

  @Input()
  record: any;

  @Input()
  type: string;

  @Input()
  detailUrl: { link: string, external: boolean };
}
