/*
 * RERO ILS UI
 * Copyright (C) 2019-2022 RERO
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

import { Component, OnDestroy, OnInit } from '@angular/core';
import { DetailRecord } from '@rero/ng-core/lib/record/detail/view/detail-record';
import { IPermissions, PERMISSIONS } from '@rero/shared';
import { Observable, Subscription } from 'rxjs';
import { OperationLogsService } from '../../../service/operation-logs.service';

interface PatronPhone {
  value: string;
  type?: string;
  weight: number;
}

@Component({
  selector: 'admin-patron-detail-view',
  templateUrl: './patron-detail-view.component.html',
  styleUrls: ['./patron-detail-view.component.scss'],
})
export class PatronDetailViewComponent implements OnInit, DetailRecord, OnDestroy {

  // COMPONENT ATTRIBUTES =====================================================
  /** Data from patron we received */
  record$: Observable<any>;
  /** the api response record */
  record: any;
  /** Current displayed/used patron */
  patron: any;
  /** record type */
  type: string;
  /** Load operation logs on show */
  showOperationLogs = false;
  /** collapsed sections */
  sectionCollapsed = {
    user: false,
    librarian: true,
    patron: false,
    notes: false
  };

  /** Subscription to (un)follow the record$ Observable */
  private _subscription$ = new Subscription();
  /** mapping to define role badge color */
  private _rolesBadgeMappings = {
    system_librarian: 'badge-danger',
    librarian: 'badge-warning'
  };

  // GETTER AND SETTER ========================================================
  /** Is operation log enabled */
  get isEnabledOperationLog(): boolean {
    return this._operationLogsService.isLogVisible('patrons');
  }

  /** Get all phones related to the patron */
  get phones(): Array<PatronPhone> {
    const data: Array<PatronPhone> = [];
    if (this.patron.mobile_phone) {
      data.push({value: this.patron.mobile_phone, type: 'Mobile', weight: 10});
    }
    if (this.patron.home_phone) {
      data.push({value: this.patron.home_phone, type: 'Home', weight: 7});
    }
    if (this.patron.business_phone) {
      data.push({value: this.patron.business_phone, type: 'Business', weight: 7});
    }
    if (this.patron.other_phone) {
      data.push({value: this.patron.other_phone, type: 'Other', weight: -1});
    }
    return data.sort((a, b) => b.weight - a.weight);
  }

  permissions: IPermissions = PERMISSIONS;

  // CONSTRUCTOR & HOOKS ======================================================
  /**
   * Constructor.
   * @param _operationLogsService - OperationLogsService
   */
  constructor(
    private _operationLogsService: OperationLogsService
  ) {}

  /** OnInit hook */
  ngOnInit() {
    this._subscription$ = this.record$.subscribe((record) => {
      this.record = record;
      this.patron = record.metadata;
    });
  }

  /** OnDestroy hook */
  ngOnDestroy() {
    this._subscription$.unsubscribe();
  }

  // COMPONENTS FUNCTIONS =====================================================

  /**
   * Get the color badge to apply for a specific role
   * @param role: the role to check.
   * @return the bootstrap badge class to use for this role.
   */
  getRoleBadgeColor(role: string): string {
    return (role in this._rolesBadgeMappings)
      ? this._rolesBadgeMappings[role]
      : 'badge-light';
  }

  /** Get the badge color to use for a note type
   *  @param noteType - the note type
   */
  getNoteBadgeColor(noteType: string): string {
    switch (noteType) {
      case 'public_note': return 'badge-info';
      case 'staff_note': return 'badge-warning';
      default: return 'badge-secondary';
    }
  }
}
