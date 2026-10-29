// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
import { AsyncPipe } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { NotificationApiService } from '@app/admin/api/notification-api.service';
import { TranslatePipe } from '@ngx-translate/core';
import { Bind } from '@openng/optimus-ui/bind';
import { Tag } from '@openng/optimus-ui/tag';
import { DateTranslatePipe, GetRecordPipe } from '@rero/ng-core';

import { CirculationLogComponent } from '../circulation-log.component';

@Component({
  selector: 'admin-circulation-log-notification',
  templateUrl: './circulation-log-notification.component.html',
  imports: [CirculationLogComponent, Bind, Tag, AsyncPipe, TranslatePipe, DateTranslatePipe, GetRecordPipe],
})
export class CirculationLogNotificationComponent {
  private NotificationApiService: NotificationApiService = inject(NotificationApiService);

  // COMPONENT ATTRIBUTES =====================================================
  /** Operation log record */
  record = input<any>();
  /** Is the log should be highlighted */
  isHighlight = input(false);
  /** Is the transaction must be separated from sibling elements */
  separator = input(false);

  /** Notification record */
  notificationRecord: any;

  /**
   * Load notification record
   * @param isCollapsed - Is the element collapsed
   */
  loadData(isCollapsed: boolean): void {
    if (!isCollapsed && this.notificationRecord === undefined) {
      this.NotificationApiService.getNotificationByPid(this.record().metadata.notification.pid).subscribe(
        (record: any) => {
          this.notificationRecord = record;
        },
      );
    }
  }
}
