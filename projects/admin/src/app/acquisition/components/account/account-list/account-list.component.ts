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
import { TranslateService } from '@ngx-translate/core';
import { ApiService, RecordService } from '@rero/ng-core';
import { IPermissions, PERMISSIONS, UserService } from '@rero/shared';

@Component({
  selector: 'admin-account-list',
  templateUrl: './account-list.component.html'
})
export class AccountListComponent implements OnInit {

  private userService: UserService = inject(UserService);
  private acqAccountApiService: AcqAccountApiService = inject(AcqAccountApiService);
  private organisationService: OrganisationService = inject(OrganisationService);
  private apiService: ApiService = inject(ApiService);
  private translateService: TranslateService = inject(TranslateService);

  // COMPONENT ATTRIBUTES =======================================================
  /** Root account to display */
  rootAccounts: IAcqAccount[] = [];

  /** Export options configuration. */
  exportOptions: {
    label: string,
    url: string,
    disabled?: boolean,
    disabled_message?: string
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
    return (this.rootAccounts.length === 0)
      ? this.translateService.instant('Result list is empty.')
      : this.translateService.instant('Too many items. Should be less than {{max}}.',
        { max: RecordService.MAX_REST_RESULTS_SIZE }
      );
  }

  /** OnInit hook */
  ngOnInit(): void {
    this._libraryPid = this.userService.user.currentLibrary;
    this.acqAccountApiService.getAccounts(this._libraryPid, null).subscribe(
      accounts => {
        this.rootAccounts = accounts;
        this.exportOptions = this._exportFormats();
      });
  }

  // COMPONENT FUNCTIONS ========================================================
  /** Operations to do when an account is deleted */
  accountDeleted(account: IAcqAccount): void {
    this.rootAccounts = this.rootAccounts.filter(item => item.pid !== account.pid);
  }

  /**
   * Get Export formats for the current resource given by configuration.
   * @return Array of export format to generate an `export as` button or an empty array.
   */
  private _exportFormats(): Array<any> {
    return exportFormats.map(
      (format) => {
        return {
          label: format.label,
          url: this.getExportFormatUrl(format),
          disabled: !this.canExport(format),
          disabled_message: this.exportInfoMessage
        };
      }
    );
  }

  /**
   * Get export format url.
   * @param format - export format object
   * @return formatted url for an export format.
   */
  getExportFormatUrl(format: any) {
    const defaultQueryParams = [
      'is_active:true',
      `library.pid:${this._libraryPid}`
    ];
    const query = defaultQueryParams.join(' AND ');
    const baseUrl = format.endpoint || this.apiService.getExportEndpointByType('acq_accounts');
    const params = new HttpParams()
      .set('q', query)
      .set('format', format.format);
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
    return (format.hasOwnProperty('disableMaxRestResultsSize') && format.disableMaxRestResultsSize)
      ? totalResults > 0
      : totalResults > 0 && totalResults < RecordService.MAX_REST_RESULTS_SIZE;
  }
}
