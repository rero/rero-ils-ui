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
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ItemApiService } from '@app/admin/api/item-api.service';
import { IssueService } from '@app/admin/service/issue.service';
import { RecordPermissionService } from '@app/admin/service/record-permission.service';
import { RecordService } from '@rero/ng-core';
import { DetailRecord } from '@rero/ng-core/lib/record/detail/view/detail-record';
import { IPermissions, IssueItemStatus, PERMISSIONS, PERMISSION_OPERATOR, UserService } from '@rero/shared';
import moment from 'moment';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable, Subscription } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Item, ItemNote } from '../../../classes/items';
import { HoldingsService } from '../../../service/holdings.service';
import { OperationLogsService } from '../../../service/operation-logs.service';
import { OrganisationService } from '../../../service/organisation.service';

@Component({
  selector: 'admin-item-detail-view',
  templateUrl: './item-detail-view.component.html',
  providers: [IssueService],
  styles: ['dl * { margin-bottom: 0; }']
})
export class ItemDetailViewComponent implements DetailRecord, OnInit, OnDestroy {

  public itemApiService: ItemApiService = inject(ItemApiService);
  private recordService: RecordService = inject(RecordService);
  private holdingService: HoldingsService = inject(HoldingsService);
  private operationLogsService: OperationLogsService= inject(OperationLogsService);
  private organisationService: OrganisationService = inject(OrganisationService);
  private issueService: IssueService = inject(IssueService);
  private recordPermissionService: RecordPermissionService = inject(RecordPermissionService);
  private userService: UserService = inject(UserService);

  /** Observable resolving record data */
  record$: Observable<any>;
  /** Resource type */
  type: string;
  /** Document record */
  record: any;
  /** Location record */
  location: any;
  /** Load operation logs on show */
  showOperationLogs = false;
  /** reference to ItemIssueStatus */
  issueItemStatus = IssueItemStatus;
  /** Record permissions */
  recordPermissions: any;

  /** Record subscription */
  private subscription: Subscription = new Subscription();

  /**
   * Is operation log enabled
   * @return boolean
   */
  get isEnabledOperationLog(): boolean {
    return this.operationLogsService.isLogVisible('items');
  }

  /**
   * Is this record is an issue
   * @return True if the record is an issue ; false otherwise
   */
  get isIssue(): boolean {
    return this.record.metadata.type === 'issue';
  }

  /**
   * Get the URL for the parent holding.
   * @return the url to parent holding.
   */
  get parentHoldingUrl(): string {
    return `/records/holdings/detail/${this.record.metadata.holding.pid}`;
  }

  /**
   * Get organisation currency
   * @return string
   */
  get organisationCurrency(): string {
    return this.organisationService.organisation.default_currency;
  }

  /** Allow claim (show button) */
  get isClaimAllowed(): boolean {
    return this.issueService.isClaimAllowed(this.record.metadata.issue.status);
  }

  /** returns an array of claim dates in DESC order */
  get claimsDates(): string[] {
    return this.record.metadata.issue.claims.dates
      .sort((a: string, b: string) => new Date(b).getTime() - new Date(a).getTime());
  }

  /** Permissions */
  permissions: IPermissions = PERMISSIONS;
  permissionOperator = PERMISSION_OPERATOR;

  /** OnInit hook */
  ngOnInit(): void {
    this.subscription.add(
      this.record$.pipe(
        switchMap((record: any) => {
          return this.recordPermissionService.getPermission('items', record.metadata.pid).pipe(
            map(permission => {
              this.recordPermissions = this.recordPermissionService
                .membership(this.userService.user, record.metadata.library.pid, permission);
              return record;
            })
          )
        })
      ).subscribe((record: any) => {
        this.record = record;
        this.recordService.getRecord('locations', record.metadata.location.pid, 1).subscribe(data => this.location = data);
      })
    );
  }

  /** OnDestroy hook */
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  /**
   * Is public note
   * @param note - ItemNote
   * @returns boolean
   */
  isPublicNote(note: ItemNote): boolean {
    return Item.PUBLIC_NOTE_TYPES.includes(note.type);
  }

  /**
   * has temporary item type
   * @return boolean
   */
  hasTemporaryItemType(): boolean {
    if ('temporary_item_type' in this.record.metadata) {
      const endDateValue = this.record.metadata.temporary_item_type.end_date || undefined;
      return !(endDateValue && moment(endDateValue).isBefore(moment()));
    }
    return false;
  }

  /** Update item status */
  updateItemStatus(): void {
    this.recordService.getRecord('items', this.record.metadata.pid, 1)
      .subscribe((item: any) => this.record = item);
  }

  /**
   * Make the method getIcon available here
   * @return string
   */
  getIcon(status: IssueItemStatus): string {
    return this.holdingService.getIcon(status);
  }

  /** Open claim dialog */
  openClaimEmailDialog(): void {
    const ref: DynamicDialogRef = this.issueService.openClaimEmailDialog(this.record);
    this.subscription.add(
      ref.onClose.subscribe((record: any) => {
        if (record) {
          this.record$.subscribe((record: any) => this.record = record);
        }
      })
    );
  }
}
