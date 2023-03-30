/*
 * RERO ILS UI
 * Copyright (C) 2023 RERO
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
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { NotificationApiService } from '@app/admin/api/notification-api.service';

@Component({
  selector: 'admin-circulation-log-notification',
  templateUrl: './circulation-log-notification.component.html',
  styleUrls: ['./circulation-log-notification.component.scss']
})
export class CirculationLogNotificationComponent {

  // COMPONENT ATTRIBUTES =====================================================
  /** Operation log record */
  @Input() record: any;
  /** Is the log should be highlighted */
  @Input() isHighlight = false;
  /** Is the transaction must be separated from sibling elements */
  @Input() separator = false;

  /** Notification record */
  notificationRecord: any;

  /**
   * Constructor
   * @param _NotificationApiService - NotificationApiService
   */
  constructor(private _NotificationApiService: NotificationApiService) {}

  /**
   * Load notification record
   * @param isCollapsed - Is the element collapsed
   */
  loadData(isCollapsed: boolean): void {
    if (!isCollapsed && this.notificationRecord === undefined) {
      this._NotificationApiService.getNotificationByPid(this.record.metadata.notification.pid)
      .subscribe((record: any) => {
        this.notificationRecord = record;
      })
    }
  }
}
