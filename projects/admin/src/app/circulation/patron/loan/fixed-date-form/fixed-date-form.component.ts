// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Component, inject, OnInit, signal, ChangeDetectionStrategy} from '@angular/core';
import { FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Library } from '@app/admin/classes/library';
import { DateValidators } from '@app/admin/utils/validators';
import { RecordService } from '@rero/ng-core';
import { AppStore } from '@rero/shared';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { NgClass, NgTemplateOutlet } from '@angular/common';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { Bind } from 'primeng/bind';
import { Button } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
    selector: 'admin-fixed-date-form',
    templateUrl: './fixed-date-form.component.html',
    imports: [FormsModule, ReactiveFormsModule, NgClass, NgTemplateOutlet, TranslateDirective, Bind, Button, TranslatePipe, DatePickerModule, CheckboxModule],
  changeDetection: ChangeDetectionStrategy.OnPush
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
      DateValidators.minimumDateValidator(
        new Date(),
        DateValidators.DATE_FORMAT
      )
    ]),
    remember: new FormControl<boolean>(false)
  });

  readonly isSending = signal(false);

  disabledDays: number[] = [];

  today: Date = new Date();

  /** OnInit hook */
  ngOnInit(): void {
    if (this.appStore.user()) {
      this.recordService.getRecord('libraries', this.appStore.currentLibraryPid(), { resolve: 1 }).subscribe(
        (data: any) => {
          const library = new Library(data.metadata);
          this.disabledDays = library.closedDays;
        }
      );
    }
  }

  // FUNCTIONS =================================================
  /** Submit form hook */
  onSubmitForm() {
    if (this.isSending()) { return; }
    this.isSending.set(true);
    this.dynamicDialogRef.close({
      action: 'submit',
      content: this.formGroup.value
    });
  }

  /** Close the modal dialog box */
  closeModal() {
    this.dynamicDialogRef.close();
  }
}
