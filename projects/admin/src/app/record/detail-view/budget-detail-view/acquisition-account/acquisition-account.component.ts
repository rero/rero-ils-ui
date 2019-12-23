/*
 * RERO ILS UI
 * Copyright (C) 2019 RERO
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
import { Component, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { RecordUiService } from '@rero/ng-core';
import { RecordPermissionMessageService } from 'projects/admin/src/app/service/record-permission-message.service';
import { BudgetTotalService } from 'projects/admin/src/app/service/budget-total.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'admin-acquisition-account',
  templateUrl: './acquisition-account.component.html'
})
export class AcquisitionAccountComponent implements OnDestroy {

  /**
   * Account record
   */
  @Input() account: any;

  /**
   * Currency code
   */
  @Input() currencyCode: string;

  /**
   * Event for delete acquisition account
   */
  @Output() deleteAcqAccount = new EventEmitter();

  /**
   * Store some observables on Subcription
   */
  private _subcription = new Subscription();

  /**
   * Constructor
   * @param _recordUiService - RecordUiService
   * @param _recordPermissionMessage - RecordPermissionMessageService
   * @param _budgetTotalService - BudgetTotalService
   */
  constructor(
    private _recordUiService: RecordUiService,
    private _recordPermissionMessage: RecordPermissionMessageService,
    private _budgetTotalService: BudgetTotalService
  ) { }

  /**
   * On Destroy
   */
  ngOnDestroy() {
    this._subcription.unsubscribe();
  }

  /**
   * Delete Acquisition account
   * @param acqAccountPid - Acquisition account pid
   */
  delete(acqAccount: any) {
    const acqAccountPid = acqAccount.metadata.pid;
    this._subcription.add(this._recordUiService.deleteRecord('acq_accounts', acqAccountPid)
    .subscribe((success: any) => {
      if (success) {
        this.deleteAcqAccount.emit(acqAccountPid);
        this._budgetTotalService.removeAmount(acqAccount.metadata.amount_allocated);
      }
    }));
  }

  /**
   * Display message if the record cannot be deleted
   * @param acqAccount - Acquisition Account record
   */
  public showDeleteMessage(acqAccount: object) {
    const message = this._recordPermissionMessage.generateMessage(acqAccount);
    this._recordUiService.showDeleteMessage(message);
  }
}
