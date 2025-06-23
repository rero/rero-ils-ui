/*
 * RERO ILS UI
 * Copyright (C) 2022-2025 RERO
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
import { Component, inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TranslateService } from '@ngx-translate/core';
import { ApiService, CONFIG, RecordService } from '@rero/ng-core';
import { Tools, UserService } from '@rero/shared';
import { DateTime } from 'luxon';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PatronTransactionApiService } from 'projects/admin/src/app/api/patron-transaction-api.service';
import { OrganisationService } from 'projects/admin/src/app/service/organisation.service';
import { CirculationStatsService } from '../../service/circulation-stats.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'admin-patron-fee',
  templateUrl: './patron-fee.component.html',
  standalone: false
})
export class PatronFeeComponent implements OnInit {

  private messageService = inject(MessageService);
  private dynamicDialogConfig: DynamicDialogConfig = inject(DynamicDialogConfig);
  private dynamicDialogRef: DynamicDialogRef = inject(DynamicDialogRef);
  private recordService: RecordService = inject(RecordService);
  private translateService: TranslateService = inject(TranslateService);
  private organisationService: OrganisationService = inject(OrganisationService);
  private userService: UserService = inject(UserService);
  private patronTransactionApiService: PatronTransactionApiService = inject(PatronTransactionApiService);
  private apiService: ApiService = inject(ApiService);
  private circulationStatsService: CirculationStatsService = inject(CirculationStatsService);

  /** form */
  form: FormGroup = new FormGroup({});
  /** form fields */
  formFields: FormlyFieldConfig[];
  /** model */
  model: FeeFormModel;

  patron: any;
  organisationPid: string | undefined;

  // /** OnInit Hook */
  ngOnInit(): void {
    const data: any = this.dynamicDialogConfig.data;
    this.patron = data.patron;
    this.organisationPid = data.organisationPid;

    const librarySchema$ = this.recordService.getSchemaForm('patron_transactions');
    librarySchema$.subscribe((schema: any) => {
      this._initForm(schema.schema.properties);
    });
  }

  submit(model: FeeFormModel): void {
    if (model.creation_date instanceof Date) {
      model.creation_date = DateTime.fromObject(model.creation_date).toISO();
    }
    this.patronTransactionApiService.addFee(model).pipe(
      switchMap(() => this.circulationStatsService.getStats(this.patron.pid))
    ).subscribe({
      next: () => {
        this.closeModal();
        this.messageService.add({
          severity: 'success',
          summary: this.translateService.instant('Patron transaction'),
          detail: this.translateService.instant('Added a new fee.'),
          life: CONFIG.MESSAGE_LIFE
        });
      },
      error: () => this.messageService.add({
        severity: 'error',
        summary: this.translateService.instant('Patron transaction'),
        detail: this.translateService.instant('An error has occurred. Please try again.'),
        sticky: true,
        closable: true
      })
    });
  }

  // /** Close modal box */
  closeModal(): void {
    this.dynamicDialogRef.close();
  }

  /** Init form model */
  private _initForm(properties: any): void {
    this.formFields = [{
      key: 'type',
      type: 'select',
      props: {
        appendTo: 'body',
        label: 'Type',
        required: true,
        options: properties.type.widget.formlyConfig.props.options
      }
    }, {
      key: 'total_amount',
      type: 'input',
      props: {
        type: 'number',
        label: 'Amount',
        required: true,
        addonLeft: [
          Tools.currencySymbol(
            this.translateService.currentLang,
            this.organisationService.organisation.default_currency
          )
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
      type: 'datePicker',
      wrappers: ['form-field'],
      props: {
        label: 'Date',
        required: true,
        dateFormat: 'yy-mm-dd'
      }
    }];

    // Default model value
    this.model = {
      type: {
        label: this.translateService.instant(properties.type.default),
        value: properties.type.default,
        data: properties.type.default
      },
      total_amount: null,
      creation_date: new Date(),
      patron: {
        $ref: this.apiService.getRefEndpoint('patrons', this.patron.pid)
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
  type: {
    label: string,
    value: string,
    data: string
  };
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
