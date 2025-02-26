/*
 * RERO ILS UI
 * Copyright (C) 2024 RERO
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

import { HttpClient } from '@angular/common/http';
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ApiService, Record } from '@rero/ng-core';
import { of, switchMap } from 'rxjs';

@Component({
    selector: 'admin-migration-data',
    templateUrl: './migration-data.component.html',
    standalone: false
})
export class MigrationDataDetailComponent {

  // services
  protected route: ActivatedRoute = inject(ActivatedRoute);
  protected http: HttpClient = inject(HttpClient);
  protected apiService: ApiService = inject(ApiService);

  // current record from the route params
  record = toSignal<any>(
    this.route.paramMap.pipe(
      switchMap(() => {
        // route params
        const docType = this.route.snapshot.params.type;
        const id = this.route.snapshot.params.pid;
        const migrationId = this.route.snapshot.queryParams.migration;
        // nothing to do
        if (docType == null || id == null || migrationId == null) {
          return of(null);
        }
        // get the record from the backend
        return this.http.get<Record>(
          `${this.apiService.getEndpointByType(docType, true)}/${id}?migration=${migrationId}`
        );
      })
    )
  );

  // log messages from the backend
  messages = computed((): {severity: string, detail: string}[] => this.getMessages());

  // conversion status
  status = computed((): string => this.record()?.conversion?.status);

  /** Get the list of the log message from the record
   *
   * @returns the list messages on the primeng format.
   */
  getMessages(): {severity: string, detail: string}[] {
    const messages = [];
    if (this.record()?.conversion.logs) {
      ['info', 'warning', 'error'].map((field) => {
        const log = this.record().conversion.logs[field];
        if (log) {
          messages.push({
            severity: field == 'warning' ? 'warn' : field,
            detail: log.join('<br/>'),
          });
        }
      });
    }
    return messages;
  }

}
