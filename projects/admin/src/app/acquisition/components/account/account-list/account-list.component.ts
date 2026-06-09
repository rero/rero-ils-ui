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
import { CurrencyPipe } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { AcqAccountApiService } from '@app/admin/acquisition/api/acq-account-api.service';
import { IAcqAccount } from '@app/admin/acquisition/classes/account';
import { exportFormats } from '@app/admin/acquisition/routes/accounts-route';
import { RecordPermissionService } from '@app/admin/service/record-permission.service';
import { TranslateDirective, TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ApiService, ExportButtonComponent, Nl2brPipe, RecordService, RecordUiService } from '@rero/ng-core';
import { AppStore, IPermissions, PERMISSIONS, PermissionsDirective } from '@rero/shared';
import { TreeNode, TreeTableNode } from 'primeng/api';
import { Bind } from 'primeng/bind';
import { Button } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { TreeTableModule } from 'primeng/treetable';
import { filter, forkJoin } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { AccountAvailableAmountPipe } from '../../../pipes/account-available-amount.pipe';

@Component({
    selector: 'admin-account-list',
    templateUrl: './account-list.component.html',
    imports: [TranslateDirective, Bind, Button, RouterLink, PermissionsDirective, ExportButtonComponent, TreeTableModule, CurrencyPipe, Nl2brPipe, TranslatePipe, AccountAvailableAmountPipe, TooltipModule],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountListComponent {
  private appStore = inject(AppStore);
  private acqAccountApiService: AcqAccountApiService = inject(AcqAccountApiService);
  private apiService: ApiService = inject(ApiService);
  private translateService: TranslateService = inject(TranslateService);
  private recordPermissionService: RecordPermissionService = inject(RecordPermissionService);
  private recordUiService = inject(RecordUiService);

  // COMPONENT ATTRIBUTES =======================================================
  /** All user permissions */
  permissions: IPermissions = PERMISSIONS;

  /** Library pid derived from user signal */
  private readonly libraryPid = computed(() => this.appStore.currentLibraryPid());

  /** Root accounts — writable signal, updated on load and mutated locally */
  readonly rootAccounts = signal<TreeTableNode[]>([]);

  /** Export options — derived from rootAccounts */
  readonly exportOptions = computed(() => this._exportFormats());

  constructor() {
    const _loaded = toSignal(
      toObservable(this.libraryPid).pipe(
        filter((pid): pid is string => !!pid),
        switchMap((pid) => {
          let localAccounts: IAcqAccount[];
          return this.acqAccountApiService.getAccounts(pid, undefined, { sort: 'depth' }).pipe(
            tap((accounts: IAcqAccount[]) => (localAccounts = accounts)),
            switchMap((accounts: any[]) =>
              forkJoin(
                accounts.map((account) =>
                  this.recordPermissionService
                    .getPermission('acq_accounts', account.pid)
                    .pipe(tap((permission) => (account.permissions = permission)))
                )
              )
            ),
            map(() => this.orderAccountsAsTree(localAccounts))
          );
        })
      ),
      { initialValue: [] as TreeTableNode[] }
    );
    effect(() => this.rootAccounts.set(_loaded()));
  }

  readonly organisation = this.appStore.organisation;

  // GETTER & SETTER ============================================================
  /** Get a message containing the reasons why record list cannot be exported */
  get exportInfoMessage(): string {
    return this.rootAccounts().length === 0
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
    this.recordUiService.deleteRecord(
      'acq_accounts',
      node.node.data.pid
    ).pipe(
      tap((success: boolean) => {
        if (success) {
          if (node.parent) {
            node.parent.children = node.parent.children.filter(
              (account) => account.data.pid !== node.node.data.pid
            );
            node.parent.leaf = !(node.parent.children.length > 0);
            this.rootAccounts.update((accounts) => [...accounts]);
          } else {
            this.rootAccounts.update((accounts) =>
              accounts.filter((account) => account.data.pid !== node.node.data.pid)
            );
          }
        }
      })
    ).subscribe();
  }

  deleteInfoMessage(permissions): string {
    return this.recordPermissionService.generateTooltipMessage(permissions.delete.reasons, 'delete');
  }

  expandAll() {
    this.rootAccounts.update((accounts) => {
      accounts.forEach((node) => this.expandRecursive(node, true));
      return [...accounts];
    });
  }

  collapseAll() {
    this.rootAccounts.update((accounts) => {
      accounts.forEach((node) => this.expandRecursive(node, false));
      return [...accounts];
    });
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
    const libraryPid = this.libraryPid();
    const defaultQueryParams = ['is_active:true', `library.pid:${libraryPid}`];
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
    const totalResults = this.rootAccounts().length;
    return Object.hasOwn(format, 'disableMaxRestResultsSize') && format.disableMaxRestResultsSize
      ? totalResults > 0
      : totalResults > 0 && totalResults < RecordService.MAX_REST_RESULTS_SIZE;
  }
}
