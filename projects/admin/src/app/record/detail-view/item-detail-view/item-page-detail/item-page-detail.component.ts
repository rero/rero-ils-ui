/*
 * RERO ILS UI
 * Copyright (C) 2019-2024 RERO
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
import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IssueService } from '@app/admin/service/issue.service';
import { OperationLogsService } from '@app/admin/service/operation-logs.service';
import { RecordPermissionService } from '@app/admin/service/record-permission.service';
import { DetailComponent, RecordDetailDirective } from '@rero/ng-core';
import { UserService } from '@rero/shared';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription, switchMap, tap } from 'rxjs';

@Component({
  selector: 'admin-item-page-detail',
  templateUrl: './item-page-detail.component.html',
})
export class ItemPageDetailComponent extends DetailComponent implements OnInit, OnDestroy {
  private operationLogsService: OperationLogsService = inject(OperationLogsService);
  private issueService: IssueService = inject(IssueService);
  private recordPermissionService: RecordPermissionService = inject(RecordPermissionService);
  private userService: UserService = inject(UserService);

  /** Record permissions */
  recordPermissions: any;
  /** Record subscription */
  private subscription: Subscription = new Subscription();

  ngOnInit(): void {
    super.ngOnInit();
    this.subscription.add(
      this.record$
        .pipe(
          switchMap((record) =>
            this.recordPermissionService.getPermission('items', record.metadata.pid).pipe(
              tap((permission) => {
                this.recordPermissions = this.recordPermissionService.membership(
                  this.userService.user,
                  record.metadata.library.pid,
                  permission
                );
              })
            )
          )
        )
        .subscribe()
    );
  }
  /** OnDestroy hook */
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  /**
   * Is this record is an issue
   * @return True if the record is an issue ; false otherwise
   */
  get isIssue(): boolean {
    return this.record.metadata.type === 'issue';
  }

  /** Allow claim (show button) */
  get isClaimAllowed(): boolean {
    return this.issueService.isClaimAllowed(this.record.metadata.issue.status);
  }

  /**
   * Is operation log enabled
   * @return boolean
   */
  get isEnabledOperationLog(): boolean {
    return this.operationLogsService.isLogVisible('items');
  }

  /** Open claim dialog */
  openClaimEmailDialog(): void {
    const ref: DynamicDialogRef = this.issueService.openClaimEmailDialog(this.record);
    this.subscription.add(
      ref.onClose.subscribe((record: any) => {
        if (record) {
          this.record$.subscribe((record: any) => (this.record = record));
        }
      })
    );
  }
}
