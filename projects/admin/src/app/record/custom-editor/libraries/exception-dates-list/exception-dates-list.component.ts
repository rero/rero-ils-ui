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


import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { ExceptionDates, Library } from '@app/admin/classes/library';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ExceptionDatesEditComponent } from '../exception-dates-edit/exception-dates-edit.component';

@Component({
  selector: 'admin-libraries-exception-dates-list',
  templateUrl: './exception-dates-list.component.html'
})
export class ExceptionDatesListComponent {

  bsModalRef: BsModalRef;

  @Input() exceptionDates;

  constructor(
    private modalService: BsModalService,
    private ref: ChangeDetectorRef
    ) { }

  addException() {
    this.bsModalRef = this.modalService.show(ExceptionDatesEditComponent, {
      initialState: {exceptionDate: null},
      class: 'modal-lg',
      backdrop: 'static'
    });

    this.bsModalRef.content.value.subscribe(value => {
      this.exceptionDates.push(value);
      // force ui update
      this.ref.markForCheck();
    });
  }

  editException(index) {
    this.bsModalRef = this.modalService.show(ExceptionDatesEditComponent, {
      initialState: {exceptionDate: this.exceptionDates[index]},
      class: 'modal-lg',
      backdrop: 'static'
    });
    this.bsModalRef.content.value.subscribe(value => {
      this.exceptionDates[index] = value;
      // force ui update
      this.ref.markForCheck();
    });
  }

  deleteException(index) {
    this.exceptionDates.splice(index, 1);
  }

  isOver(exception: ExceptionDates): boolean {
    return Library.isExceptionDateOver(exception);
  }
}
