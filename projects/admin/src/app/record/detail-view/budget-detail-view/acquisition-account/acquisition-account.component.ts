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
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { RecordUiService } from '@rero/ng-core';
import { BudgetTotalService } from 'projects/admin/src/app/service/budget-total.service';
import { RecordPermissionService } from 'projects/admin/src/app/service/record-permission.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'admin-acquisition-account',
  templateUrl: './acquisition-account.component.html'
})
export class AcquisitionAccountComponent implements OnInit, OnDestroy {

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
   * account permissions
   */
  permissions: any;

  /**
   * Constructor
   * @param _recordUiService - RecordUiService
   * @param _recordPermissionService - RecordPermissionService
   * @param _budgetTotalService - BudgetTotalService
   */
  constructor(
    private _recordUiService: RecordUiService,
    private _recordPermissionService: RecordPermissionService,
    private _budgetTotalService: BudgetTotalService
  ) { }

  /**
   * On Init
   */
  ngOnInit() {
    this._recordPermissionService.getPermission('acq_accounts', this.account.metadata.pid).subscribe(
      (permissions) => this.permissions = permissions
    );
  }

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
   * Return a message containing the reasons why the item cannot be requested
   * @return the message to display into the tooltip box
   */
  get deleteInfoMessage(): string {
    return this._recordPermissionService.generateDeleteMessage(this.permissions.delete.reasons);
  }
}
