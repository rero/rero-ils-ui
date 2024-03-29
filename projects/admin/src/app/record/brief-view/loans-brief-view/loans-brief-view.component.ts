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
import { Component, Input, OnInit } from '@angular/core';
import { ResultItem } from '@rero/ng-core';
import { PermissionsService } from '@rero/shared';
import moment from 'moment/moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { LoanState } from '../../../classes/loans';
import { CirculationLogsComponent } from '../../circulation-logs/circulation-logs.component';

@Component({
  selector: 'admin-loans-brief-view',
  templateUrl: './loans-brief-view.component.html',
  styleUrls: ['./loans-brief-view.component.scss']
})
export class LoansBriefViewComponent implements ResultItem, OnInit {

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
  stateClass: string = null;
  /** Reference on LoanState */
  loanState = LoanState;
  /** is the current request is expired */
  isRequestExpired = false;
  /** Modal ref */
  bsModalRef: BsModalRef;

  // GETTER & SETTER =========================================================
  /**
   * Is the debug mode could be activated ?
   * @returns True if the debug mode can be enabled and switched
   */
  get canUseDebugMode(): boolean {
    return this.permissionsService.canAccessDebugMode();
  }

  // CONSTRUCTOR & HOOKS ======================================================
  /**
   * Constructor
   * @param modalService - BsModalService
   * @param permissionsService - PermissionsService
   */
  constructor(
    private modalService: BsModalService,
    private permissionsService: PermissionsService
  ){ }

  /** OnInit hook */
  ngOnInit() {
    // State bullet color
    this._getBadgeStyle();
    // Is request is expired
    if ('request_expire_date' in this.record.metadata) {
      const requestExpireDate = moment(this.record.metadata.request_expire_date);
      this.isRequestExpired = moment().isSameOrAfter(requestExpireDate);
    }
  }

  // COMPONENT FUNCTIONS ======================================================
  /** Open transaction history logs dialog */
  openTransactionHistoryDialog(loanPid: string): void {
    const config = {
      ignoreBackdropClick: false,
      keyboard: true,
      initialState: {
        resourcePid: loanPid,
        resourceType: 'loan'
      }
    };
    this.bsModalRef = this.modalService.show(CirculationLogsComponent, config);
    this.bsModalRef.content.dialogClose$.subscribe((value: boolean) => {
      if (value) {
        this.bsModalRef.hide();
      }
    });
  }

  // PRIVATE COMPONENT FUNCTIONS ==============================================

  /** Define the bullet color. */
  private _getBadgeStyle(): void {
    switch (this.record.metadata.state) {
      case LoanState.CREATED:
      case LoanState.PENDING:
      case LoanState.ITEM_AT_DESK:
        this.stateClass = 'badge-info';
        break;
      case LoanState.ITEM_ON_LOAN:
        this.stateClass = 'badge-success';
        break;
      case LoanState.ITEM_IN_TRANSIT_FOR_PICKUP:
      case LoanState.ITEM_IN_TRANSIT_TO_HOUSE:
        this.stateClass = 'badge-warning';
    }
  }
}
