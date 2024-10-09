/*
 * RERO ILS UI
 * Copyright (C) 2019-2024 RERO
 * Copyright (C) 2019-2023 UCLouvain
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
import { Component, inject, OnInit } from '@angular/core';
import { IllRequestApiService } from '@app/admin/api/ill-request-api.service';
import { PatronService } from '@app/admin/service/patron.service';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'admin-ill-request',
  templateUrl: './ill-request.component.html'
})
export class IllRequestComponent implements OnInit {

  private illRequestApiService: IllRequestApiService = inject(IllRequestApiService);
  private patronService: PatronService = inject(PatronService);

  // COMPONENT ATTRIBUTES =====================================================
  /** Ill records observable */
  illRequests$: Observable<any>;

  /** OnInit hook */
  ngOnInit(): void {
    this.illRequests$ = this.patronService.currentPatron$.pipe(
      switchMap((patron: any) => {
        return (!patron)
          ? of(null)
          : this.illRequestApiService.getByPatronPid(patron.pid, {remove_archived: '1'})
      }
    ));
  }
}
