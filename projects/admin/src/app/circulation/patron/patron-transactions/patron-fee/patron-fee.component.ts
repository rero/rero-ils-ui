// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PatronTransactionApiService } from '@app/admin/api/patron-transaction-api.service';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MessageService } from '@openng/optimus-ui/api';
import { Bind } from '@openng/optimus-ui/bind';
import { Button } from '@openng/optimus-ui/button';
import { DynamicDialogConfig, DynamicDialogRef } from '@openng/optimus-ui/dynamicdialog';
import { ApiService, CONFIG, HttpPendingService, RecordService } from '@rero/ng-core';
import { AppStore, Tools } from '@rero/shared';
import { DateTime } from 'luxon';

@Component({
  selector: 'admin-patron-fee',
  templateUrl: './patron-fee.component.html',
  imports: [FormsModule, ReactiveFormsModule, FormlyModule, Bind, Button, TranslatePipe],
})
export class PatronFeeComponent implements OnInit {
  private messageService = inject(MessageService);
  private dynamicDialogConfig: DynamicDialogConfig = inject(DynamicDialogConfig);
  private dynamicDialogRef: DynamicDialogRef = inject(DynamicDialogRef);
  private recordService: RecordService = inject(RecordService);
  private translateService: TranslateService = inject(TranslateService);
  private appStore = inject(AppStore);
  private patronTransactionApiService: PatronTransactionApiService = inject(PatronTransactionApiService);
  private apiService: ApiService = inject(ApiService);
  readonly httpPending = inject(HttpPendingService);

  /** form */
  form: FormGroup = new FormGroup({});
  /** form fields */
  formFields = signal<FormlyFieldConfig[] | undefined>(undefined);
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
    if (this.httpPending.isPending()) {
      return;
    }
    if (model.creation_date instanceof Date) {
      model.creation_date = DateTime.fromObject(model.creation_date).toISO();
    }
    this.patronTransactionApiService.addFee(model).subscribe({
      next: () => {
        this.closeModal();
        this.messageService.add({
          severity: 'success',
          summary: this.translateService.instant('Patron transaction'),
          detail: this.translateService.instant('Added a new fee.'),
          life: CONFIG.MESSAGE_LIFE,
        });
      },
      error: () =>
        this.messageService.add({
          severity: 'error',
          summary: this.translateService.instant('Patron transaction'),
          detail: this.translateService.instant('An error has occurred. Please try again.'),
          sticky: true,
          closable: true,
        }),
    });
  }

  // /** Close modal box */
  closeModal(): void {
    this.dynamicDialogRef.close();
  }

  /** Init form model */
  private _initForm(properties: any): void {
    this.formFields.set([
      {
        key: 'type',
        type: 'select',
        props: {
          appendTo: 'body',
          label: 'Type',
          required: true,
          options: properties.type.widget.formlyConfig.props.options,
        },
      },
      {
        key: 'total_amount',
        type: 'input',
        props: {
          type: 'number',
          label: 'Amount',
          required: true,
          addonLeft: [
            Tools.currencySymbol(this.translateService.getCurrentLang(), this.appStore.organisation().default_currency),
          ],
        },
      },
      {
        key: 'note',
        type: 'input',
        props: {
          label: 'Note',
        },
      },
      {
        key: 'creation_date',
        type: 'datePicker',
        wrappers: ['form-field'],
        props: {
          label: 'Date',
          required: true,
          dateFormat: 'yy-mm-dd',
        },
      },
    ]);

    // Default model value
    this.model = {
      type: {
        label: this.translateService.instant(properties.type.default),
        value: properties.type.default,
        data: properties.type.default,
      },
      total_amount: null,
      creation_date: new Date(),
      patron: {
        $ref: this.apiService.getRefEndpoint('patrons', this.patron.pid),
      },
      organisation: {
        $ref: this.apiService.getRefEndpoint('organisations', this.organisationPid),
      },
      library: {
        $ref: this.apiService.getRefEndpoint('libraries', this.appStore.currentLibraryPid()),
      },
      status: 'open',
      event: {
        operator: {
          $ref: this.apiService.getRefEndpoint('patrons', this.appStore.user()?.patronLibrarian.pid),
        },
        library: {
          $ref: this.apiService.getRefEndpoint('libraries', this.appStore.currentLibraryPid()),
        },
      },
    };
  }
}

/** Interface to define fields on form */
export type FeeFormModel = {
  type: {
    label: string;
    value: string;
    data: string;
  };
  total_amount: number;
  note?: string;
  creation_date: any;
  patron: {
    $ref: string;
  };
  library: {
    $ref: string;
  };
  organisation: {
    $ref: string;
  };
  status: string;
  event: {
    operator: {
      $ref: string;
    };
    library: {
      $ref: string;
    };
  };
};
