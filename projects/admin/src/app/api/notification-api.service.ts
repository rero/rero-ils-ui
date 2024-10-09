/*
 * RERO ILS UI
 * Copyright (C) 2023-2024 RERO
 * Copyright (C) 2023 UCLouvain
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
import { inject, Injectable } from '@angular/core';
import { RecordService } from '@rero/ng-core';
import { BaseApi } from '@rero/shared';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NotificationApiService extends BaseApi {

  private recordService: RecordService = inject(RecordService);

  /** Resource name */
  readonly RESOURCE_NAME = 'notifications';

  getNotificationByPid(pid: string): any {
    return this.recordService.getRecord(this.RESOURCE_NAME, pid).pipe(
      map((result: any) => result.metadata)
    );
  }
}
