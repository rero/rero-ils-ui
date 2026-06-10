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
import { ChangeDetectionStrategy, Component, effect, inject, input, model, signal } from '@angular/core';
import { ItemApiService } from '@app/admin/api/item-api.service';
import { IssueService } from '@app/admin/service/issue.service';
import { DateTranslatePipe, GetRecordPipe, Nl2brPipe, RecordService } from '@rero/ng-core';

import { AsyncPipe, JsonPipe, NgClass, NgPlural, NgPluralCase } from '@angular/common';
import { CentsCurrencyPipe } from '../../../acquisition/pipes/cents-currency.pipe';
import { RouterLink } from '@angular/router';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { AppStore, AvailabilityComponent, InheritedCallNumberComponent, IPermissions, IssueItemStatus, ItemHoldingsCallNumberPipe, KeyExistsPipe, MainTitlePipe, OperationLogsService, PERMISSION_OPERATOR, PERMISSIONS, PermissionsDirective, SafeUrlPipe } from '@rero/shared';
import { DateTime } from 'luxon';
import { Badge } from 'primeng/badge';
import { Bind } from 'primeng/bind';
import { Button } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from 'primeng/tabs';
import { Tooltip } from 'primeng/tooltip';
import { Item, ItemNote } from '../../../classes/items';
import { ItemInCollectionPipe } from '../../../pipe/item-in-collection.pipe';
import { HoldingsService } from '../../../service/holdings.service';
import { CirculationLogsDialogComponent } from '../../circulation-logs/circulation-logs-dialog.component';
import { LocalFieldComponent } from '../local-field/local-field.component';
import { RecordMaskedComponent } from '../record-masked/record-masked.component';
import { ItemFeesComponent } from './item-fees/item-fees.component';
import { ItemTransactionsComponent } from './item-transactions/item-transactions.component';

@Component({
    selector: 'admin-item-detail-view',
    templateUrl: './item-detail-view.component.html',
    providers: [IssueService],
    styles: ['dl * { margin-bottom: 0; }'],
    imports: [Bind, Button, RouterLink, RecordMaskedComponent, TranslateDirective, InheritedCallNumberComponent, AvailabilityComponent, NgClass, Tooltip, Tabs, TabList, Ripple, Tab, NgPlural, NgPluralCase, TabPanels, TabPanel, CirculationLogsDialogComponent, ItemTransactionsComponent, ItemFeesComponent, PermissionsDirective, LocalFieldComponent, AsyncPipe, JsonPipe, CentsCurrencyPipe, TranslatePipe, DateTranslatePipe, GetRecordPipe, ItemHoldingsCallNumberPipe, KeyExistsPipe, MainTitlePipe, Nl2brPipe, SafeUrlPipe, ItemInCollectionPipe, Badge],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemDetailViewComponent {

  public itemApiService: ItemApiService = inject(ItemApiService);
  private recordService: RecordService = inject(RecordService);
  private holdingService: HoldingsService = inject(HoldingsService);
  private operationLogsService: OperationLogsService= inject(OperationLogsService);
  private appStore = inject(AppStore);

  /** Document record */
  record = model<any>();
  /** Resource type */
  type = input<string>('');
  /** Record permissions */
  recordPermissions = input<any>();

  /** Permissions */
  permissions: IPermissions = PERMISSIONS;
  permissionOperator = PERMISSION_OPERATOR;

  /** Location record */
  readonly location = signal<any>(null);
  /** Load operation logs on show */
  showOperationLogs = false;
  /** reference to ItemIssueStatus */
  issueItemStatus = IssueItemStatus;

  constructor() {
    effect(() => {
      const record = this.record();
      if (record != null) {
        this.recordService.getRecord('locations', record.metadata.location.pid, { resolve: 1 }).subscribe(data => this.location.set(data));
      }
    });
  }

  /**
   * Is operation log enabled
   * @return boolean
   */
  get isEnabledOperationLog(): boolean {
    return this.operationLogsService.isLogVisible('items');
  }

  get isDisplayLocalFieldsTab(): boolean {
    return this.appStore.currentLibraryPid() === this.record()?.metadata.library.pid;
  }

  /**
   * Get organisation currency
   * @return string
   */
  get organisationCurrency(): string {
    return this.appStore.organisation().default_currency;
  }

  /** returns an array of claim dates in DESC order */
  get claimsDates(): string[] {
    return this.record()?.metadata.issue.claims.dates
      .sort((a: string, b: string) => new Date(b).getTime() - new Date(a).getTime());
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
    const metadata = this.record()?.metadata;
    if (metadata && 'temporary_item_type' in metadata) {
      const endDateValue = metadata.temporary_item_type.end_date || undefined;
      return !(endDateValue && DateTime.fromISO(endDateValue) < DateTime.now());
    }
    return false;
  }

  /** Update item status */
  updateItemStatus(): void {
    this.recordService.getRecord('items', this.record()?.metadata.pid, { resolve: 1 })
      .subscribe((item: any) => this.record.set(item));
  }

  /**
   * Make the method getIcon available here
   * @return string
   */
  getIcon(status: IssueItemStatus): string {
    return this.holdingService.getIcon(status);
  }
}
