/*
 * RERO ILS UI
 * Copyright (C) 2020 RERO
 * Copyright (C) 2020 UCLouvain
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
import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { RecordService } from '@rero/ng-core';
import { UserService } from '@rero/shared';
import moment from 'moment';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Library } from 'projects/admin/src/app/classes/library';
import { DateValidators } from 'projects/admin/src/app/utils/validators';


@Component({
  selector: 'admin-fixed-date-form',
  templateUrl: './fixed-date-form.component.html'
})
export class FixedDateFormComponent implements OnInit {

  /** the date format to used */
  static DATE_FORMAT = 'YYYY-MM-DD';

  // COMPONENT ATTRIBUTES ====================================
  /** form group */
  formGroup: FormGroup = new FormGroup({
    endDate: new FormControl('', [
      Validators.required,
      DateValidators.minimumDateValidator(
        new Date(),
        FixedDateFormComponent.DATE_FORMAT
      )
    ])
  });
  /** main datepicker configuration */
  bsConfig = {
    showWeekNumbers: false,
    containerClass: 'theme-dark-blue',
    dateInputFormat: FixedDateFormComponent.DATE_FORMAT,
    minDate: moment().toDate(),
    daysDisabled: []
  };
  /** fixed date emitter */
  onSubmit = new EventEmitter();


  // CONSTRUCTOR & HOOKS =====================================
  /**
   * Constructor
   * @param _localeService - BsLocaleService
   * @param _modalService - BsModalService
   * @param _bsModalRef - BsModalRef
   * @param _translateService - TranslateService,
   * @param _userService - UserService
   * @param _recordService - RecordService
   */
  constructor(
    private _localeService: BsLocaleService,
    private _modalService: BsModalService,
    protected _bsModalRef: BsModalRef,
    private _translateService: TranslateService,
    private _userService: UserService,
    private _recordService: RecordService,
  ) { }


  /** OnInit hook */
  ngOnInit(): void {
    this._localeService.use(this._translateService.currentLang);
    if (this._userService.user) {
      this._recordService.getRecord('libraries', this._userService.user.getCurrentLibrary(), 1).subscribe(
        (data: any) => {
          const library = new Library(data.metadata);
          this.bsConfig.daysDisabled = library.closedDays;
          // TODO :: Try to manage the exception dates
          //   The problem is the exception dates generation is not perfect (repeatability is not managed) and take a long time.
          //   If user has already clicked on the input, the datePicker widget is used without this configuration (it's pity)
          //   --> but if user choose an exception closed date, then the backend will compute the best opening day and return this value ;
          //       if asked end_date is different from API response, the `LoanComponent` will display a toastr message to inform the staff
          //       member.
          // this.bsConfig.datesDisabled(library.exceptionClosedDates);
        }
      );
    }
    this._initValueChange();
  }

  // FUNCTIONS =================================================
  /** Submit form hook */
  onSubmitForm() {
    this.onSubmit.emit({
      action: 'submit',
      content: this.formGroup.value
    });
    this._bsModalRef.hide();
  }

  /** Close the modal dialog box */
  closeModal() {
    this._bsModalRef.hide();
  }

  /** Init value change on field */
  private _initValueChange() {
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
  }
}
