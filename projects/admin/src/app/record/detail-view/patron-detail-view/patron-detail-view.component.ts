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
import { Component, OnInit } from '@angular/core';
import { DetailRecord } from '@rero/ng-core/lib/record/detail/view/detail-record';
import { Observable } from 'rxjs';
import { PatronService } from '../../../service/patron.service';

@Component({
  selector: 'admin-patron-detail-view',
  templateUrl: './patron-detail-view.component.html'
})
export class PatronDetailViewComponent implements OnInit, DetailRecord {

  record$: Observable<any>;

  record: any;

  type: string;

  constructor(private patronService: PatronService) { }

  ngOnInit() {
    this.record$.subscribe(record => {
      this.record = record;
      this.patronService.setRecord(record);
    });
  }

  get isPatron() {
    return this.patronService.hasRole('patron');
  }

  get isLibrarian() {
    return this.patronService.hasRole('librarian');
  }
}
