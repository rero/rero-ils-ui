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

import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { DetailRecord } from '@rero/ng-core/lib/record/detail/view/detail-record';
import { IPermissions, PERMISSIONS, PermissionsService } from '@rero/shared';
import { Observable, Subscription } from 'rxjs';
import { OperationLogsService } from '../../../service/operation-logs.service';
import { roleBadgeColor } from '../../../utils/roles';

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

  private operationLogsService: OperationLogsService = inject(OperationLogsService);
  private permissionsService: PermissionsService = inject(PermissionsService);

  // COMPONENT ATTRIBUTES =====================================================
  /** Data from patron we received */
  record$: Observable<any>;
  /** the api response record */
  record: any;
  /** Current displayed/used patron */
  patron: any;
  /** Patron phones */
  phones: PatronPhone[] = [];
  /** record type */
  type: string;
  /** Load operation logs on show */
  showOperationLogs = false;
  /** collapsed sections */
  sectionCollapsed = {
    user: false,
    librarian: true,
    patron: false,
    permissions: true,
    notes: false
  };

  /** Subscription to (un)follow the record$ Observable */
  private subscription$ = new Subscription();

  // GETTER AND SETTER ========================================================
  /** Is operation log enabled */
  get isEnabledOperationLog(): boolean {
    return this.operationLogsService.isLogVisible('patrons');
  }

  permissions: IPermissions = PERMISSIONS;

  get canAccessDisplayPermissions(): boolean {
    return this.permissionsService.canAccess(PERMISSIONS.PERM_MANAGEMENT);
  }

  /** OnInit hook */
  ngOnInit() {
    this.subscription$ = this.record$.subscribe((record) => {
      this.record = record;
      this.patron = record.metadata;
      this.phones = this.processPhones(record.metadata);
    });
  }

  /** OnDestroy hook */
  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }

  // COMPONENTS FUNCTIONS =====================================================

  /**
   * Get the color badge to apply for a specific role
   * @param role: the role to check.
   * @return the bootstrap badge class to use for this role.
   */
  getRoleBadgeColor(role: string): string {
    return roleBadgeColor(role);
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

  private processPhones(record: any): PatronPhone[] {
    const data: PatronPhone[] = [];
    if (record.mobile_phone) {
      data.push({value: record.mobile_phone, type: 'Mobile', weight: 10});
    }
    if (record.home_phone) {
      data.push({value: record.home_phone, type: 'Home', weight: 7});
    }
    if (record.business_phone) {
      data.push({value: record.business_phone, type: 'Business', weight: 7});
    }
    if (record.other_phone) {
      data.push({value: record.other_phone, type: 'Other', weight: -1});
    }
    return data.sort((a, b) => b.weight - a.weight);
  }
}
