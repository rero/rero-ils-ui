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
import { Component } from '@angular/core';
import { DetailRecord } from '@rero/ng-core/lib/record/detail/view/detail-record';
import { Observable } from 'rxjs';

@Component({
  selector: 'admin-patron-types-detail-view',
  template: `
  <ng-container *ngIf="record$ | async as record">
    <h1>{{ record.metadata.name }}</h1>
    {{ record.metadata.description }}
  </ng-container>`,
  styles: []
})
export class PatronTypesDetailViewComponent implements DetailRecord {

  record$: Observable<any>;

  type: string;

  constructor() { }
}
