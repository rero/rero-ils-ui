/*
 * RERO ILS UI
 * Copyright (C) 2020 RERO
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
import { PatronService } from '../../../service/patron.service';

@Component({
  selector: 'admin-history',
  templateUrl: './history.component.html'
})
export class HistoryComponent implements OnInit {

  /** history Loans */
  loans = [];
  /** is loading */
  isLoading = false;

  /**
   * Constructor
   * @param _patronService - PatronService
   */
  constructor(
    private _patronService: PatronService
  ) { }

  /**
   * Component initialization.
   * Load current patron loans history.
   */
  ngOnInit() {
    this._patronService.currentPatron$.subscribe((patron: any) => {
      if (patron) {
        this._patronService.getHistory(patron.pid).subscribe(
          (loans) => {
            this.loans = loans;
            this.isLoading = true;
          });
      }
    });
  }

}
