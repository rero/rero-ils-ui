/*
 * RERO ILS UI
 * Copyright (C) 2022-2024 RERO
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
import { getCurrencySymbol } from '@angular/common';
import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TranslateService } from '@ngx-translate/core';
import { ApiService, RecordService } from '@rero/ng-core';
import { UserService } from '@rero/shared';
import { DateTime } from 'luxon';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { PatronTransactionApiService } from 'projects/admin/src/app/api/patron-transaction-api.service';
import { OrganisationService } from 'projects/admin/src/app/service/organisation.service';

@Component({
  selector: 'admin-patron-fee',
  templateUrl: './patron-fee.component.html',
  styles: ['.p-inputtext { width: 100%; padding: 0 }']
})
export class PatronFeeComponent implements OnInit {

  // COMPONENT ATTRIBUTES =====================================================
  /** Patron pid */
  @Input() patronPid: string;
  /** Organisation pid */
  @Input() organisationPid: string;

  /** form */
  form: FormGroup = new FormGroup({});
  /** form fields */
  formFields: FormlyFieldConfig[];
  /** model */
  model: FeeFormModel;
  /** On submit event */
  onSubmit: EventEmitter<any> = new EventEmitter();

  // CONSTRUCTOR & HOOKS ======================================================
  /**
   * Constructor
   * @param recordService - RecordService
   * @param bsModalRef - BsModalRef
   * @param toastr - ToastrService
   * @param translateService - TranslateService
   * @param organisationService - OrganisationService
   * @param userService - UserService
   * @param patronTransactionApiService - PatronTransactionApiService
   * @param apiService - ApiService
   */
  constructor(
    private recordService: RecordService,
    private bsModalRef: BsModalRef,
    private toastr: ToastrService,
    private translateService: TranslateService,
    private organisationService: OrganisationService,
    private userService: UserService,
    private patronTransactionApiService: PatronTransactionApiService,
    private apiService: ApiService
  ) { }

  /** OnInit Hook */
  ngOnInit(): void {
    if (!this.patronPid) {
      this.closeModal();
    }
    const librarySchema$ = this.recordService.getSchemaForm('patron_transactions');
    librarySchema$.subscribe((schema: any) => {
      this._initForm(schema.schema.properties);
    });
  }

  // COMPONENT FUNCTIONS ======================================================
  /**
   * Submit the form
   * @param model - Fee model
   */
  submit(model: FeeFormModel): void {
    if (model.creation_date instanceof Date) {
      model.creation_date = DateTime.fromObject(model.creation_date).toISO();
    }
    this.patronTransactionApiService.addFee(model).subscribe(
      () => {
        this.onSubmit.next('submit');
        this.closeModal();
        this.toastr.success(
          this.translateService.instant('Added a new fee.'),
          this.translateService.instant('Patron transaction')
        );
      },
      () => {
        this.toastr.error(
          this.translateService.instant('An error has occurred. Please try again.'),
          this.translateService.instant('Patron transaction'),
          { disableTimeOut: true }
        );
      }
    );
  }

  /** Close modal box */
  closeModal(): void {
    this.bsModalRef.hide();
  }

  /** Init form model */
  private _initForm(properties: any): void {
    this.formFields = [{
      key: 'type',
      type: 'selectWithSort',
      props: {
        label: 'Type',
        required: true,
        options: properties.type.form.options
      }
    }, {
      key: 'total_amount',
      type: 'input',
      props: {
        type: 'number',
        label: 'Amount',
        required: true,
        addonLeft: [
          getCurrencySymbol(this.organisationService.organisation.default_currency, 'wide')
        ]
      }
    }, {
      key: 'note',
      type: 'input',
      props: {
        label: 'Note'
      }
    }, {
      key: 'creation_date',
      type: 'dateTimePicker',
      wrappers: ['form-field'],
      props: {
        label: 'Date',
        required: true,
        dateFormat: 'yy-mm-dd',
      }
    }];

    // Default model value
    this.model = {
      type: null,
      total_amount: null,
      creation_date: new Date(),
      patron: {
        $ref: this.apiService.getRefEndpoint('patrons', this.patronPid)
      },
      organisation: {
        $ref: this.apiService.getRefEndpoint('organisations', this.organisationPid)
      },
      library: {
        $ref: this.apiService.getRefEndpoint('libraries', this.userService.user.currentLibrary)
      },
      status: 'open',
      event: {
        operator: {
          $ref: this.apiService.getRefEndpoint('patrons', this.userService.user.patronLibrarian.pid)
        },
        library: {
          $ref: this.apiService.getRefEndpoint('libraries', this.userService.user.currentLibrary)
        }
      }
    }
  }
}

/** Interface to define fields on form */
export interface FeeFormModel {
  type: string;
  total_amount: number;
  note?: string;
  creation_date: any;
  patron: {
    $ref: string;
  },
  library: {
    $ref: string
  }
  organisation: {
    $ref: string;
  };
  status: string;
  event: {
    operator: {
      $ref: string;
    },
    library: {
      $ref: string
    }
  }
}
