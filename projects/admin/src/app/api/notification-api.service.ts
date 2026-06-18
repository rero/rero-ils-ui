// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
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
