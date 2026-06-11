/*
 * RERO ILS UI
 * Copyright (C) 2019-2026 RERO
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
