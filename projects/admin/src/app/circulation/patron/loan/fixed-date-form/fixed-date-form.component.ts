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
import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { RecordService } from '@rero/ng-core';
import { UserService } from '@rero/shared';
import moment from 'moment';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Library } from 'projects/admin/src/app/classes/library';
import { DateValidators } from 'projects/admin/src/app/utils/validators';
import { Subscription } from 'rxjs';
import { CirculationService } from '../../../services/circulation.service';


@Component({
  selector: 'admin-fixed-date-form',
  templateUrl: './fixed-date-form.component.html'
})
export class FixedDateFormComponent implements OnInit, OnDestroy {

  /** the date format to used */
  static DATE_FORMAT = 'YYYY-MM-DD';

  // COMPONENT ATTRIBUTES ====================================
  /** form group */
  formGroup: UntypedFormGroup = new UntypedFormGroup({
    endDate: new UntypedFormControl('', [
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
    daysDisabled: [],
    datesDisabled: []
  };
  /** fixed date emitter */
  onSubmit = new EventEmitter();

  /** component subscriptions */
  private _subscription = new Subscription();


  // CONSTRUCTOR & HOOKS =====================================
  /**
   * Constructor
   * @param _localeService - BsLocaleService
   * @param _bsModalRef - BsModalRef
   * @param _translateService - TranslateService,
   * @param _userService - UserService
   * @param _recordService - RecordService
   * @param _circulationService - CirculationService
   */
  constructor(
    private _localeService: BsLocaleService,
    protected _bsModalRef: BsModalRef,
    private _translateService: TranslateService,
    private _userService: UserService,
    private _recordService: RecordService,
    private _circulationService: CirculationService
  ) { }


  /** OnInit hook */
  ngOnInit(): void {
    this._localeService.use(this._translateService.currentLang);
    if (this._userService.user) {
      this._recordService.getRecord('libraries', this._userService.user.currentLibrary, 1).subscribe(
        (data: any) => {
          const library = new Library(data.metadata);
          this.bsConfig.daysDisabled = library.closedDays;
        }
      );
      this._subscription.add(this._circulationService.currentLibraryClosedDates$.subscribe(
        data => this.bsConfig.datesDisabled = data
      ));
    }
    this._initValueChange();
  }

  /** OnDestroy hook */
  ngOnDestroy(): void {
    this._subscription.unsubscribe();
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
