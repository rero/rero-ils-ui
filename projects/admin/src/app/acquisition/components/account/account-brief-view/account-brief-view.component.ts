/*
 * RERO ILS UI
 * Copyright (C) 2021-2024 RERO
 * Copyright (C) 2021 UCLouvain
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

import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { RecordPermissions } from '@app/admin/classes/permissions';
import { OrganisationService } from '@app/admin/service/organisation.service';
import { RecordPermissionService } from '@app/admin/service/record-permission.service';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '@rero/shared';
import { MessageService } from 'primeng/api';
import { AcqAccountApiService } from '../../../api/acq-account-api.service';
import { IAcqAccount } from '../../../classes/account';

@Component({
  selector: 'admin-account-brief-view',
  templateUrl: './account-brief-view.component.html',
  styleUrls: ['../../../acquisition.scss']
})
export class AccountBriefViewComponent implements OnInit {

  private messageService = inject(MessageService);

  // COMPONENT ATTRIBUTES ========================================================
  /** the account to display */
  @Input() account: IAcqAccount = null;
  /** does we need to load and display the children accounts */
  @Input() loadChildren = false;
  /** event emit when the account is deleted */
  @Output() deleteAccount = new EventEmitter();

  /** permission about the record */
  permissions: any;
  /** children accounts */
  children: IAcqAccount[] = [];


  // GETTER & SETTER ============================================================
  /** Get the current budget pid for the organisation */
  get organisation(): any {
    return this.organisationService.organisation;
  }

  /** Get the URL to access detail view for this account */
  get detailUrl(): string {
    return `/records/acq_accounts/detail/${this.account.pid}`;
  }

  /**
   * Return a message containing the reasons why the item cannot be requested
   * @return the message to display into the tooltip box
   */
  get deleteInfoMessage(): string {
    return this.recordPermissionService.generateDeleteMessage(this.permissions.delete.reasons);
  }

  // CONSTRUCTOR & HOOKS ========================================================
  /**
   * Constructor
   * @param recordPermissionService - RecordPermissionService
   * @param organisationService - OrganisationService
   * @param accountApiService - AcqAccountApiService
   * @param translateService - TranslateService
   * @param userService - UserService
   */
  constructor(
    private recordPermissionService: RecordPermissionService,
    private organisationService: OrganisationService,
    private accountApiService: AcqAccountApiService,
    private translateService: TranslateService,
    private userService: UserService
  ) { }

  /** OnInit hook */
  ngOnInit(): void {
    if (this.account) {
      // load account permissions
      this.recordPermissionService
        .getPermission('acq_accounts', this.account.pid)
        .subscribe((data: RecordPermissions) => this.permissions = data);
      // load children accounts
      if (this.loadChildren) {
        const libraryPid = this.userService.user.currentLibrary;
        this.accountApiService
          .getAccounts(libraryPid, this.account.pid)
          .subscribe(accounts => this.children = accounts);
      }
    }
  }

  // COMPONENT FUNCTIONS ========================================================
  /** Delete the account */
  delete() {
    this.accountApiService
      .delete(this.account.pid)
      .subscribe(() => {
        this.messageService.add({
          severity: 'success',
          summary: this.translateService.instant('Account'),
          detail: this.translateService.instant('Account deleted')
        });
        this.deleteAccount.emit(this.account);
      });
  }

  /** Operations to do when an account is deleted */
  accountDeleted(account: IAcqAccount): void {
    this.children = this.children.filter(item => item.pid !== account.pid);
  }
}
