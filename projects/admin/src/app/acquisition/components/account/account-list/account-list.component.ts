/*
 * RERO ILS UI
 * Copyright (C) 2022-2024 RERO
 * Copyright (C) 2022 UCLouvain
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
import { HttpParams } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { AcqAccountApiService } from '@app/admin/acquisition/api/acq-account-api.service';
import { IAcqAccount } from '@app/admin/acquisition/classes/account';
import { exportFormats } from '@app/admin/acquisition/routes/accounts-route';
import { OrganisationService } from '@app/admin/service/organisation.service';
import { RecordPermissionService } from '@app/admin/service/record-permission.service';
import { TranslateService } from '@ngx-translate/core';
import { ApiService, CONFIG, RecordService } from '@rero/ng-core';
import { IPermissions, PERMISSIONS, UserService } from '@rero/shared';
import { MessageService, TreeNode, TreeTableNode } from 'primeng/api';
import { forkJoin, switchMap, tap } from 'rxjs';

@Component({
    selector: 'admin-account-list',
    templateUrl: './account-list.component.html',
    standalone: false
})
export class AccountListComponent implements OnInit {
  private userService: UserService = inject(UserService);
  private acqAccountApiService: AcqAccountApiService = inject(AcqAccountApiService);
  private organisationService: OrganisationService = inject(OrganisationService);
  private apiService: ApiService = inject(ApiService);
  private translateService: TranslateService = inject(TranslateService);
  private recordPermissionService: RecordPermissionService = inject(RecordPermissionService);
  private messageService: MessageService = inject(MessageService);

  // COMPONENT ATTRIBUTES =======================================================
  /** Root account to display */
  rootAccounts: TreeTableNode[] = [];

  /** Export options configuration. */
  exportOptions: {
    label: string;
    url: string;
    disabled?: boolean;
    disabled_message?: string;
  }[];

  /** All user permissions */
  permissions: IPermissions = PERMISSIONS;

  /** Store library pid */
  private _libraryPid: string;

  // GETTER & SETTER ============================================================
  /** Get the current organisation */
  get organisation(): any {
    return this.organisationService.organisation;
  }

  /** Get a message containing the reasons why record list cannot be exported */
  get exportInfoMessage(): string {
    return this.rootAccounts.length === 0
      ? this.translateService.instant('Result list is empty.')
      : this.translateService.instant('Too many items. Should be less than {{max}}.', {
          max: RecordService.MAX_REST_RESULTS_SIZE,
        });
  }

  private orderAccountsAsTree(accounts): TreeTableNode[] {
    const accountsByPid = {};
    accounts = this.processAccount(accounts);
    accounts.map((val) => {
      const key = val?.data?.parent?.pid ? val.data.parent.pid : -1;
      if (!accountsByPid[key]) {
        accountsByPid[key] = [];
      }
      accountsByPid[key].push(val);
    });
    const localAccounts = accountsByPid[-1].sort((a, b) => a.label.localeCompare(b.label));
    this.attachChildren(localAccounts, accountsByPid);
    return localAccounts;
  }

  private attachChildren(accounts, accountsByPid) {
    accounts.map((val) => {
      if (accountsByPid[val.data.pid]) {
        val.children = accountsByPid[val.data.pid].sort((a, b) => a.label.localeCompare(b.label));
        this.attachChildren(val.children, accountsByPid);
      }
    });
  }
  /** OnInit hook */
  ngOnInit(): void {
    this._libraryPid = this.userService.user.currentLibrary;
    let localAccounts;
    this.acqAccountApiService
      .getAccounts(this._libraryPid, undefined, { sort: 'depth' })
      .pipe(
        tap((accounts: IAcqAccount[]) => (localAccounts = accounts)),
        switchMap((accounts: any[]) => {
          const obs = accounts.map((account) =>
            this.recordPermissionService
              .getPermission('acq_accounts', account.pid)
              .pipe(tap((permission) => (account.permissions = permission)))
          );
          return forkJoin(obs);
        }),
        tap(() => (this.rootAccounts = this.orderAccountsAsTree(localAccounts))),
        tap(() => (this.exportOptions = this._exportFormats()))
      )
      .subscribe();
  }

  processAccount(accounts) {
    return accounts.map((account) => {
      return {
        data: account,
        label: account.name,
        leaf: !(account?.number_of_children > 0),
      };
    });
  }
  // COMPONENT FUNCTIONS ========================================================
  /** Operations to do when an account is deleted */
  accountDelete(node): void {
    this.acqAccountApiService
      .delete(node.node.data.pid)
      .pipe(
        tap(() => {
          if (node.parent) {
            node.parent.children = node.parent.children.filter((account) => account.data.pid !== node.node.data.pid);
            node.parent.leaf = !(node.parent.children.length > 0);
          } else {
            this.rootAccounts = this.rootAccounts.filter((account) => account.data.pid !== node.node.data.pid);
          }
          this.rootAccounts = [...this.rootAccounts];
        })
      )
      .subscribe(() => {
        this.messageService.add({
          severity: 'success',
          summary: this.translateService.instant('Account'),
          detail: this.translateService.instant('Account deleted'),
          life: CONFIG.MESSAGE_LIFE,
        });
      });
  }

  deleteInfoMessage(permissions): string {
    return this.recordPermissionService.generateTooltipMessage(permissions.delete.reasons, 'delete');
  }

  expandAll() {
    this.rootAccounts.forEach((node) => {
      this.expandRecursive(node, true);
    });
    this.rootAccounts = [...this.rootAccounts];
  }

  collapseAll() {
    this.rootAccounts.forEach((node) => {
      this.expandRecursive(node, false);
    });
    this.rootAccounts = [...this.rootAccounts];
  }

  private expandRecursive(node: TreeNode, isExpand: boolean) {
    node.expanded = isExpand;
    if (node.children) {
      node.children.forEach((childNode) => {
        this.expandRecursive(childNode, isExpand);
      });
    }
  }

  /**
   * Get Export formats for the current resource given by configuration.
   * @return Array of export format to generate an `export as` button or an empty array.
   */
  private _exportFormats(): any[] {
    return exportFormats.map((format) => {
      return {
        label: format.label,
        url: this.getExportFormatUrl(format),
        disabled: !this.canExport(format),
        disabled_message: this.exportInfoMessage,
      };
    });
  }

  /**
   * Get export format url.
   * @param format - export format object
   * @return formatted url for an export format.
   */
  getExportFormatUrl(format: any) {
    const defaultQueryParams = ['is_active:true', `library.pid:${this._libraryPid}`];
    const query = defaultQueryParams.join(' AND ');
    const baseUrl = format.endpoint || this.apiService.getExportEndpointByType('acq_accounts');
    const params = new HttpParams().set('q', query).set('format', format.format);
    if (!format.disableMaxRestResultsSize) {
      params.append('size', String(RecordService.MAX_REST_RESULTS_SIZE));
    }
    return `${baseUrl}?${params.toString()}`;
  }

  /**
   * Check if a record list can be exported
   * @param format - export format object
   * @return Boolean
   */
  canExport(format: any): boolean {
    const totalResults = this.rootAccounts.length;
    return format.hasOwnProperty('disableMaxRestResultsSize') && format.disableMaxRestResultsSize
      ? totalResults > 0
      : totalResults > 0 && totalResults < RecordService.MAX_REST_RESULTS_SIZE;
  }
}
