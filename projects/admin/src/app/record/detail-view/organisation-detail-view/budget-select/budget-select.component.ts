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
import { Component, Input, OnInit } from '@angular/core';
import { RecordService } from '@rero/ng-core';
import { Record } from '@rero/ng-core/lib/record/record';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'admin-budget-select',
  templateUrl: './budget-select.component.html'
})
export class BudgetSelectComponent implements OnInit {

  /**
   * Organisation record
   */
  @Input() organisation: any;

  /**
   * Array of budgets
   */
  budgets$: Observable<Array<any>>;

  /**
   * Constructor
   * @param recordService - RecordService
   */
  constructor(private _recordService: RecordService) {}

  /**
   * Init
   */
  ngOnInit() {
    const query = `organisation.pid:${this.organisation.metadata.pid} AND is_active:true`;
    this.budgets$ = this._recordService.getRecords(
      'budgets', query, 1, RecordService.MAX_REST_RESULTS_SIZE,
      undefined, undefined, undefined, undefined
    ).pipe(
      map((hits: Record) => hits.hits.total === 0 ? [] : hits.hits.hits)
    );
  }
}
