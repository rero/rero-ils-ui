/*
 * RERO ILS UI
 * Copyright (C) 2019-2024 RERO
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
import { Component, inject, Input } from '@angular/core';
import { ExceptionDates, Library } from '@app/admin/classes/library';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ExceptionDatesEditComponent } from '../exception-dates-edit/exception-dates-edit.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'admin-libraries-exception-dates-list',
    templateUrl: './exception-dates-list.component.html',
    standalone: false
})
export class ExceptionDatesListComponent {

  private dialogService: DialogService = inject(DialogService);
  private translateService: TranslateService = inject(TranslateService);

  private dynamicDialogRef: DynamicDialogRef | undefined;

  @Input() exceptionDates = [];

  editException(index: number): void {
    this.dynamicDialogRef = this.dialogService.open(ExceptionDatesEditComponent, {
      header: this.translateService.instant('Exception'),
      modal: true,
      width: '50vw',
      closable: false,
      data: {
        exceptionDate: this.exceptionDates[index]
      }
    });
    this.dynamicDialogRef.onClose.subscribe((value?: any) => {
      if (value) {
        this.exceptionDates[index] = value;
      }
    });
  }

  deleteException(index: number): void {
    this.exceptionDates.splice(index, 1);
  }

  isOver(exception: ExceptionDates): boolean {
    return Library.isExceptionDateOver(exception);
  }
}
