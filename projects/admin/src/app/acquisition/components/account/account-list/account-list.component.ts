/*
 * RERO ILS UI
 * Copyright (C) 2021 RERO
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
import { Component, OnInit } from '@angular/core';
import { UserService } from '@rero/shared';
import { OrganisationService } from '../../../../service/organisation.service';
import { IAcqAccount } from '../../../classes/account';
import { AcqAccountApiService } from '../../../api/acq-account-api.service';

@Component({
  selector: 'admin-account-list',
  templateUrl: './account-list.component.html'
})
export class AccountListComponent implements OnInit {

  // COMPONENT ATTRIBUTES =======================================================
  /** Root account to display */
  rootAccounts: IAcqAccount[] = [];


  // GETTER & SETTER ============================================================
  /** Get the current organisation */
  get organisation(): any {
    return this._organisationService.organisation;
  }

  // CONSTRUCTOR & HOOKS ========================================================
  /**
   * Constructor
   * @param _userService: UserService
   * @param _acqAccountApiService: AcqAccountApiService
   * @param _organisationService: OrganisationService
   */
  constructor(
    private _userService: UserService,
    private _acqAccountApiService: AcqAccountApiService,
    private _organisationService: OrganisationService
  ) { }

  /** OnInit hook */
  ngOnInit(): void {
    const libraryPid = this._userService.user.currentLibrary;
    this._acqAccountApiService.getAccounts(libraryPid, null).subscribe(accounts => this.rootAccounts = accounts);
  }

  // COMPONENT FUNCTIONS ========================================================
  /** Operations to do when an account is deleted */
  accountDeleted(account: IAcqAccount): void {
    this.rootAccounts = this.rootAccounts.filter(item => item.pid !== account.pid);
  }

}
