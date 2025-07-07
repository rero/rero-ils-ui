/*
 * RERO ILS UI
 * Copyright (C) 2022-2024 RERO
 * Copyright (C) 2022-2023 UCLouvain
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
import { Component, inject, Input, OnInit } from '@angular/core';
import { ResultItem } from '@rero/ng-core';
import { PermissionsService } from '@rero/shared';
import { DateTime } from 'luxon';
import { DialogService } from 'primeng/dynamicdialog';
import { LoanState } from '../../../classes/loans';
import { CirculationLogsComponent } from '../../circulation-logs/circulation-logs.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'admin-loans-brief-view',
    templateUrl: './loans-brief-view.component.html',
    standalone: false
})
export class LoansBriefViewComponent implements ResultItem, OnInit {

  private dialogService: DialogService = inject(DialogService);
  private permissionsService: PermissionsService = inject(PermissionsService);
  private translateService: TranslateService = inject(TranslateService);

  // COMPONENT ATTRIBUTES =====================================================
  /** Information to build the URL on the record detail view. */
  @Input() detailUrl: { link: string; external: boolean };
  /** The record to perform. */
  @Input() record: any;
  /** The type of the record. */
  @Input() type: string;

  /** debug mode toggle */
  debugMode = false;
  /** class to use for the state bullet */
  tagSeverity: string = null;
  /** Reference on LoanState */
  loanState = LoanState;
  /** is the current request is expired */
  isRequestExpired = false;

  // GETTER & SETTER =========================================================
  /**
   * Is the debug mode could be activated ?
   * @returns True if the debug mode can be enabled and switched
   */
  get canUseDebugMode(): boolean {
    return this.permissionsService.canAccessDebugMode();
  }

  // HOOKS ======================================================
  /** OnInit hook */
  ngOnInit() {
    // State bullet color
    this.setTagSeverity();
    // Is request is expired
    if ('request_expire_date' in this.record.metadata) {
      const requestExpireDate = DateTime.fromISO(this.record.metadata.request_expire_date);
      this.isRequestExpired = DateTime.now() >= requestExpireDate;
    }
  }

  // COMPONENT FUNCTIONS ======================================================
  /** Open transaction history logs dialog */
  openTransactionHistoryDialog(loanPid: string): void {
    this.dialogService.open(CirculationLogsComponent, {
      header: this.translateService.instant("Circulation history"),
      modal: true,
      width: '60vw',
      closable: true,
      data: {
        resourcePid: loanPid,
        resourceType: 'loan'
      }
    });
  }

  // PRIVATE COMPONENT FUNCTIONS ==============================================

  /** Define the bullet color. */
  private setTagSeverity(): void {
    switch (this.record.metadata.state) {
      case LoanState.CREATED:
      case LoanState.PENDING:
      case LoanState.ITEM_AT_DESK:
        this.tagSeverity = 'info';
        break;
      case LoanState.ITEM_ON_LOAN:
        this.tagSeverity = 'success';
        break;
      case LoanState.ITEM_IN_TRANSIT_FOR_PICKUP:
      case LoanState.ITEM_IN_TRANSIT_TO_HOUSE:
        this.tagSeverity = 'warn';
    }
  }
}
