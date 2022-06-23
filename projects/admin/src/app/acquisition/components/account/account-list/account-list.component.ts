/*
 * RERO ILS UI
 * Copyright (C) 2022 RERO
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
import { Component, OnInit } from '@angular/core';
import { UserService } from '@rero/shared';
import { OrganisationService } from '../../../../service/organisation.service';
import { IAcqAccount } from '../../../classes/account';
import { AcqAccountApiService } from '../../../api/acq-account-api.service';
import { ApiService, RecordService } from '@rero/ng-core';
import { TranslateService } from '@ngx-translate/core';
import { exportFormats } from '../../../routes/accounts-route';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'admin-account-list',
  templateUrl: './account-list.component.html'
})
export class AccountListComponent implements OnInit {

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

  /** Store library pid */
  private _libraryPid: string;


  // GETTER & SETTER ============================================================
  /** Get the current organisation */
  get organisation(): any {
    return this._organisationService.organisation;
  }

  /** Get a message containing the reasons why record list cannot be exported */
  get exportInfoMessage(): string {
    return (this.rootAccounts.length === 0)
      ? this._translateService.instant('Result list is empty.')
      : this._translateService.instant('Too many items. Should be less than {{max}}.',
        { max: RecordService.MAX_REST_RESULTS_SIZE }
      );
  }

  // CONSTRUCTOR & HOOKS ========================================================
  /**
   * Constructor
   * @param _userService: UserService
   * @param _acqAccountApiService: AcqAccountApiService
   * @param _organisationService: OrganisationService
   * @param _apiService: ApiService
   * @param _translateService: TranslateService
   */
  constructor(
    private _userService: UserService,
    private _acqAccountApiService: AcqAccountApiService,
    private _organisationService: OrganisationService,
    private _apiService: ApiService,
    private _translateService: TranslateService,
  ) { }

  /** OnInit hook */
  ngOnInit(): void {
    this._libraryPid = this._userService.user.currentLibrary;
    this._acqAccountApiService.getAccounts(this._libraryPid, null).subscribe(
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
    const baseUrl = format.endpoint
      ? format.endpoint
      : this._apiService.getExportEndpointByType('acq_accounts');
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
      : 0 < totalResults && totalResults < RecordService.MAX_REST_RESULTS_SIZE;
  }
}
