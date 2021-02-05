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
import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { RecordService } from '@rero/ng-core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { LoanApiService } from '../../../api/loan-api.service';
import { Loan } from '../../../class/items';

@Component({
  selector: 'admin-update-loan-form',
  templateUrl: './update-loan-form.component.html'
})
export class UpdateLoanFormComponent implements OnInit {

  /** the date format to used */
  static DATE_FORMAT = 'YYYY-MM-DD';
  /** loan record metadata */
  loan: Loan;

  // COMPONENT ATTRIBUTES ====================================
  /** form group */
  formGroup: FormGroup = new FormGroup({
    endDate: new FormControl('', [
      Validators.required,
    ])
  });
  /** main datepicker configuration */
  bsConfig = {
    showWeekNumbers: false,
    containerClass: 'theme-dark-blue',
    dateInputFormat: UpdateLoanFormComponent.DATE_FORMAT,
  };

  // CONSTRUCTOR & HOOKS =====================================
  /**
   * Constructor
   * @param _modalService - BsModalService
   * @param _bsModalRef - BsModalRef
   * @param _translateService - TranslateService,
   * @param _recordService - RecordService
   * @param _loanApiService - LoanApiService
   * @param _toastrService - ToastrService,
   */
  constructor(
    private _modalService: BsModalService,
    protected _bsModalRef: BsModalRef,
    private _translateService: TranslateService,
    private _recordService: RecordService,
    private _loanApiService: LoanApiService,
    private _toastrService: ToastrService
  ) { }

  /** OnInit hook */
  ngOnInit(): void {
    const endDateField = this.formGroup.get('endDate');
    endDateField.valueChanges.subscribe(isoDate => {
      let patchDate: any = null;
      if (isoDate != null) {
        try {
          const date = new Date(isoDate);
          patchDate = formatDate(date, 'yyyy-MM-dd', this._translateService.currentLang);
        } catch {
          patchDate = undefined;
        }
      }
      if (endDateField.value !== patchDate) {
        endDateField.patchValue(patchDate);
      }
    });
    endDateField.patchValue(this.loan.end_date);
  }

  // FUNCTIONS =================================================
  /** Submit form hook */
  onSubmitForm() {
    const formValues = this.formGroup.value;
    const changes = [];

    // end_date field management ~~~~~~~~~~~~~~~~~~~~
    const endDateChanged = (formValues.endDate !== this.loan.end_date.format(UpdateLoanFormComponent.DATE_FORMAT));
    if (endDateChanged) {
      const endDate = new Date(formValues.endDate);
      endDate.setHours(
        this.loan.end_date.hour(),
        this.loan.end_date.minutes(),
        this.loan.end_date.seconds()
      );
      changes.push({path: 'end_date', value: endDate.toISOString()});
    }
    // TODO :: Manage other changed here

    // If some data are changed, then update the loan
    if (Object.keys(changes).length > 0) {
      this._loanApiService.patch(this.loan.pid, changes).subscribe(record => {
        this.loan = this.loan.assign(record.metadata);  // this will also update the parent component.
        this._toastrService.success(this._translateService.instant('Loan updated.'));
        this.closeModal();
      });
    } else {
      this.closeModal();
    }
  }

  /** Close the modal dialog box */
  closeModal() {
    this._bsModalRef.hide();
  }

}
