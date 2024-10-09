/*
 * RERO ILS UI
 * Copyright (C) 2020-2023 RERO
 * Copyright (C) 2020-2023 UCLouvain
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
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Library } from '@app/admin/classes/library';
import { DateValidators } from '@app/admin/utils/validators';
import { TranslateService } from '@ngx-translate/core';
import { RecordService } from '@rero/ng-core';
import { UserService } from '@rero/shared';
import moment from 'moment';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { CirculationService } from '../../../services/circulation.service';


@Component({
  selector: 'admin-fixed-date-form',
  templateUrl: './fixed-date-form.component.html'
})
export class FixedDateFormComponent implements OnInit, OnDestroy {

  private dynamicDialogRef: DynamicDialogRef = inject(DynamicDialogRef);
  private translateService: TranslateService = inject(TranslateService);
  private userService: UserService = inject(UserService);
  private recordService: RecordService = inject(RecordService);
  private circulationService: CirculationService = inject(CirculationService);

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
    ]),
    remember: new FormControl(false)
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

  /** component subscriptions */
  private subscription = new Subscription();

  /** OnInit hook */
  ngOnInit(): void {
    if (this.userService.user) {
      this.recordService.getRecord('libraries', this.userService.user.currentLibrary, 1).subscribe(
        (data: any) => {
          const library = new Library(data.metadata);
          this.bsConfig.daysDisabled = library.closedDays;
        }
      );
      this.subscription.add(this.circulationService.currentLibraryClosedDates$.subscribe(
        data => this.bsConfig.datesDisabled = data
      ));
    }
    this._initValueChange();
  }

  /** OnDestroy hook */
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  // FUNCTIONS =================================================
  /** Submit form hook */
  onSubmitForm() {
    this.dynamicDialogRef.close({
      action: 'submit',
      content: this.formGroup.value
    });
  }

  /** Close the modal dialog box */
  closeModal() {
    this.dynamicDialogRef.close();
  }

  /** Init value change on field */
  private _initValueChange() {
    const endDateField = this.formGroup.get('endDate');
    endDateField.valueChanges.subscribe(isoDate => {
      let patchDate: any = null;
      if (isoDate != null) {
        try {
          const date = new Date(isoDate);
          patchDate = formatDate(date, 'yyyy-MM-dd', this.translateService.currentLang);
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
