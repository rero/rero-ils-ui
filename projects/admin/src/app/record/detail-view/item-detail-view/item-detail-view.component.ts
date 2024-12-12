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
import { AfterViewInit, Component, inject, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { ItemApiService } from '@app/admin/api/item-api.service';
import { IssueService } from '@app/admin/service/issue.service';
import { RecordService } from '@rero/ng-core';
import { DetailRecord } from '@rero/ng-core/lib/record/detail/view/detail-record';
import { IPermissions, IssueItemStatus, PERMISSION_OPERATOR, PERMISSIONS } from '@rero/shared';
import { DateTime } from 'luxon';
import { Observable, Subscription } from 'rxjs';
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
export class ItemDetailViewComponent implements OnChanges, OnDestroy {

  public itemApiService: ItemApiService = inject(ItemApiService);
  private recordService: RecordService = inject(RecordService);
  private holdingService: HoldingsService = inject(HoldingsService);
  private operationLogsService: OperationLogsService= inject(OperationLogsService);
  private organisationService: OrganisationService = inject(OrganisationService);

  /** Document record */
  @Input() record: any;
  /** Record permissions */
  @Input() recordPermissions: any;

  /** Permissions */
  permissions: IPermissions = PERMISSIONS;
  permissionOperator = PERMISSION_OPERATOR;

  /** Location record */
  location: any;
  /** Load operation logs on show */
  showOperationLogs = false;
  /** reference to ItemIssueStatus */
  issueItemStatus = IssueItemStatus;

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
   * Get organisation currency
   * @return string
   */
  get organisationCurrency(): string {
    return this.organisationService.organisation.default_currency;
  }

  /** returns an array of claim dates in DESC order */
  get claimsDates(): string[] {
    return this.record.metadata.issue.claims.dates
      .sort((a: string, b: string) => new Date(b).getTime() - new Date(a).getTime());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes?.record?.currentValue != null) {
      this.recordService.getRecord('locations', changes.record.currentValue.metadata.location.pid, 1).subscribe(data => this.location = data);
    }
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
      return !(endDateValue && DateTime.fromISO(endDateValue) < DateTime.now());
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
}
