/*
 * RERO ILS UI
 * Copyright (C) 2021 RERO
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
import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { LoanApiService } from '../../../api/loan-api.service';
import { UserService } from '../../../user.service';
import { PatronProfileService } from '../../patron-profile.service';

@Component({
  selector: 'public-search-patron-profile-request',
  templateUrl: './patron-profile-request.component.html'
})
export class PatronProfileRequestComponent {

  /** Request record */
  @Input() record: any;

  /** Document section is collapsed */
  isCollapsed = true;

  /** Renew action done */
  actionDone = false;

  /** Cancel action success */
  actionSuccess = false;

  /** Cancel in progress */
  cancelInProgress = false;

  /** Get current viewcode */
  get viewcode(): string {
    return this._userService.user.organisation.code;
  }

  /**
   * Constructor
   * @param _loanApiService - LoanApiService
   * @param _userService - UserService
   * @param _translateService - TranslateService
   * @param _toastService - ToastrService
   * @param _patronProfileService - PatronProfileService
   */
  constructor(
    private _loanApiService: LoanApiService,
    private _userService: UserService,
    private _translateService: TranslateService,
    private _toastService: ToastrService,
    private _patronProfileService: PatronProfileService
  ) { }

  /** Cancel a request */
  cancel(): void {
    this.cancelInProgress = true;
    this._loanApiService.cancel({
      pid: this.record.metadata.pid,
      transaction_location_pid: this.record.metadata.item.location.pid,
      transaction_user_pid: this._userService.user.pid
    }).subscribe((cancelLoan: any) => {
      if (cancelLoan !== undefined) {
        this._patronProfileService.cancelRequest(this.record.metadata.pid);
        this.actionDone = true;
        this._toastService.success(
          this._translateService.instant('The request has been cancelled.'),
          this._translateService.instant('Success')
        );
      } else {
        this.cancelInProgress = false;
        this._toastService.error(
          this._translateService.instant('Error during the cancellation of the request.'),
          this._translateService.instant('Error')
        );
      }
    });
  }
}
