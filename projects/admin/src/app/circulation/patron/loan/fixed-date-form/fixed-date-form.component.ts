// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
import { NgClass, NgTemplateOutlet } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Library } from '@app/admin/classes/library';
import { DateValidators } from '@app/admin/utils/validators';
import { TranslatePipe } from '@ngx-translate/core';
import { Bind } from '@openng/optimus-ui/bind';
import { Button } from '@openng/optimus-ui/button';
import { CheckboxModule } from '@openng/optimus-ui/checkbox';
import { DatePickerModule } from '@openng/optimus-ui/datepicker';
import { DynamicDialogRef } from '@openng/optimus-ui/dynamicdialog';
import { RecordService } from '@rero/ng-core';
import { AppStore } from '@rero/shared';

@Component({
  selector: 'admin-fixed-date-form',
  templateUrl: './fixed-date-form.component.html',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgClass,
    NgTemplateOutlet,
    Bind,
    Button,
    TranslatePipe,
    DatePickerModule,
    CheckboxModule,
  ],
})
export class FixedDateFormComponent implements OnInit {
  private dynamicDialogRef: DynamicDialogRef = inject(DynamicDialogRef);
  private appStore = inject(AppStore);
  private recordService: RecordService = inject(RecordService);

  // COMPONENT ATTRIBUTES ====================================
  /** form group */
  formGroup: FormGroup = new FormGroup({
    endDate: new FormControl('', [
      Validators.required,
      DateValidators.minimumDateValidator(new Date(), DateValidators.DATE_FORMAT),
    ]),
    remember: new FormControl<boolean>(false),
  });

  readonly isSending = signal(false);

  disabledDays: number[] = [];

  today: Date = new Date();

  /** OnInit hook */
  ngOnInit(): void {
    if (this.appStore.user()) {
      this.recordService
        .getRecord('libraries', this.appStore.currentLibraryPid(), { resolve: 1 })
        .subscribe((data: any) => {
          const library = new Library(data.metadata);
          this.disabledDays = library.closedDays;
        });
    }
  }

  // FUNCTIONS =================================================
  /** Submit form hook */
  onSubmitForm() {
    if (this.isSending()) {
      return;
    }
    this.isSending.set(true);
    this.dynamicDialogRef.close({
      action: 'submit',
      content: this.formGroup.value,
    });
  }

  /** Close the modal dialog box */
  closeModal() {
    this.dynamicDialogRef.close();
  }
}
