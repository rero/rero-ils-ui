// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Component, inject, input, ChangeDetectionStrategy} from '@angular/core';
import { NotificationApiService } from '@app/admin/api/notification-api.service';
import { CirculationLogComponent } from '../circulation-log.component';
import { Bind } from 'primeng/bind';
import { Tag } from 'primeng/tag';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { AsyncPipe } from '@angular/common';
import { DateTranslatePipe, GetRecordPipe } from '@rero/ng-core';

@Component({
    selector: 'admin-circulation-log-notification',
    templateUrl: './circulation-log-notification.component.html',
    imports: [CirculationLogComponent, Bind, Tag, TranslateDirective, AsyncPipe, TranslatePipe, DateTranslatePipe, GetRecordPipe],
  changeDetection: ChangeDetectionStrategy.OnPush
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
      this.NotificationApiService.getNotificationByPid(this.record().metadata.notification.pid)
      .subscribe((record: any) => {
        this.notificationRecord = record;
      })
    }
  }
}
