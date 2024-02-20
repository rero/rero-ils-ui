/*
 * RERO ILS UI
 * Copyright (C) 2021-2024 RERO
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
import { Component, Input, OnInit } from '@angular/core';
import { LoanOverduePreview } from '@app/admin/classes/loans';
import { TranslateService } from '@ngx-translate/core';
import { IOrganisation } from '@rero/shared';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';
import { CanExtend, LoanApiService } from '../../../api/loan-api.service';
import { PatronProfileMenuService } from '../../patron-profile-menu.service';
import { PatronProfileService } from '../../patron-profile.service';

@Component({
  selector: 'public-search-patron-profile-loan',
  templateUrl: './patron-profile-loan.component.html',
  styleUrls: ['./patron-profile-loan.component.scss']
})
export class PatronProfileLoanComponent implements OnInit {

  // COMPONENT ATTRIBUTES =====================================================
  /** Loan record */
  @Input() record: any;

  /** Document section is collapsed */
  isCollapsed = true;
  /** Renew action done */
  actionDone = false;
  /** Renew action success */
  actionSuccess = false;
  /** Request in progress */
  renewInProgress = false;
  /** Loan can extend */
  canExtend = {
    can: false,
    reasons: []
  };
  /** Fees */
  fees: number = 0;

  // GETTER & SETTER ==========================================================
  /** Get organisation for current patron */
  get organisation(): IOrganisation {
    return this.patronProfileMenuService.currentPatron.organisation;
  }

  /** Get current viewcode */
  get viewcode(): string {
    return this.patronProfileMenuService.currentPatron.organisation.code;
  }
  /** Check if the loan should be returned in very few days */
  get isDueSoon(): boolean {
    return (this.record.metadata.is_late)
      ? false
      : new moment(this.record.metadata.due_soon_date) <= moment();
  }

  // CONSTRUCTOR & HOOKS ======================================================
  /**
   * Constructor
   * @param loanApiService - LoanApiService
   * @param translateService - TranslateService
   * @param toastService - ToastrService
   * @param patronProfileMenuService - PatronProfileMenuService
   * @param patronProfileService - PatronProfileService
   */
  constructor(
    private loanApiService: LoanApiService,
    private translateService: TranslateService,
    private toastService: ToastrService,
    private patronProfileMenuService: PatronProfileMenuService,
    private patronProfileService: PatronProfileService
  ) {}

  /** OnInit hook */
  ngOnInit(): void {
    this.loanApiService
      .canExtend(this.record.metadata.pid)
      .subscribe((response: CanExtend) => this.canExtend = response);
    if (this.record.metadata.overdue) {
      this.loanApiService
        .getPreviewOverdue(this.record.metadata.pid)
        .subscribe((response: LoanOverduePreview) => {
          this.fees = +response.total.toFixed(2);
          this.patronProfileService.loanFees(this.fees);
        });
    }
  }

  // COMPONENTS FUNCTIONS =====================================================
  /** Renew the current loan */
  renew(): void {
    const patronPid = this.patronProfileMenuService.currentPatron.pid;
    this.renewInProgress = true;
    this.loanApiService.renew({
      pid: this.record.metadata.pid,
      item_pid: this.record.metadata.item.pid,
      transaction_location_pid: this.record.metadata.item.location.pid,
      transaction_user_pid: patronPid
    })
      .pipe(finalize(() => this.renewInProgress = false))
      .subscribe((extendLoan: any) => {
      this.actionDone = true;
      if (extendLoan !== undefined) {
        this.actionSuccess = true;
        this.record.metadata.end_date = extendLoan.end_date;
        this.record.metadata.extension_count = extendLoan.extension_count;
        if ('overdue' in this.record.metadata) {
          delete this.record.metadata.overdue;
        }
        this.toastService.success(
          this.translateService.instant('The item has been renewed.'),
          this.translateService.instant('Success')
        );
      } else {
        this.toastService.error(
          this.translateService.instant('Error during the renewal of the item.'),
          this.translateService.instant('Error')
        );
      }
    });
  }
}
