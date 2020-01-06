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

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RecordService } from '@rero/ng-core';
import { map } from 'rxjs/operators';
import { User } from '../../../class/user';

@Component({
  selector: 'admin-circulation-patron-detailed',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  @Input() patron: User;
  @Output() clearPatron = new EventEmitter<User>();
  patronType$: any;

  constructor(private recordService: RecordService) { }

  ngOnInit() {
    if (this.patron) {
      this.patronType$ = this.recordService.getRecord('patron_types', this.patron.patron_type.pid).pipe(
        map(patronType => patronType.metadata.name)
      );
    }
  }

  clear() {
    if (this.patron) {
      this.clearPatron.emit(this.patron);
    }
  }
}
