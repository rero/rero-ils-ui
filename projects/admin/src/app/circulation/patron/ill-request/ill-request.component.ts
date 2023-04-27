/*
 * RERO ILS UI
 * Copyright (C) 2023 RERO
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
import { IllRequestApiService } from '@app/admin/api/ill-request-api.service';
import { PatronService } from '@app/admin/service/patron.service';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'admin-ill-request',
  templateUrl: './ill-request.component.html'
})
export class IllRequestComponent implements OnInit {

  /** Ill records observable */
  illRequests$: Observable<any>;

  /**
   * Constructor
   * @param _illRequestApiService - IllRequestApiService
   * @param _patronService - PatronService
   */
  constructor(
    private _illRequestApiService: IllRequestApiService,
    private _patronService: PatronService
  ) { }

  /** onInit hook */
  ngOnInit(): void {
    this.illRequests$ = this._patronService.currentPatron$.pipe(
      switchMap((patron: any) => {
        return (!patron)
          ? of(null)
          : this._illRequestApiService.getByPatronPid(patron.pid)
      }
    ));
  }
}
