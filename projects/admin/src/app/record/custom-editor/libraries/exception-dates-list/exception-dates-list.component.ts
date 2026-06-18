// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { ExceptionDates, Library } from '@app/admin/classes/library';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Bind } from 'primeng/bind';
import { Button } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';
import { take } from 'rxjs/operators';
import { ExceptionDateComponent } from '../../../detail-view/library-detail-view/exception-date/exception-date.component';
import { ExceptionDatesEditComponent } from '../exception-dates-edit/exception-dates-edit.component';
import { LibraryStore } from '../library.store';

@Component({
    selector: 'admin-libraries-exception-dates-list',
    templateUrl: './exception-dates-list.component.html',
    imports: [ExceptionDateComponent, Bind, Button, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExceptionDatesListComponent {

  private dialogService: DialogService = inject(DialogService);
  private translateService: TranslateService = inject(TranslateService);
  private readonly libraryStore = inject(LibraryStore);

  exceptionDates = input<ExceptionDates[]>([]);

  editException(index: number): void {
    const ref = this.dialogService.open(ExceptionDatesEditComponent, {
      header: this.translateService.instant('Exception'),
      modal: true,
      width: '50vw',
      closable: false,
      data: {
        exceptionDate: this.exceptionDates()[index]
      }
    });
    ref?.onClose.pipe(take(1)).subscribe((value?: ExceptionDates) => {
      if (value) {
        this.libraryStore.updateExceptionDate(index, value);
      }
    });
  }

  deleteException(index: number): void {
    this.libraryStore.deleteExceptionDate(index);
  }

  isOver(exception: ExceptionDates): boolean {
    return Library.isExceptionDateOver(exception);
  }
}
