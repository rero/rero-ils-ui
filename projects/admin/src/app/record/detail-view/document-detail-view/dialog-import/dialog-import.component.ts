/*
 * RERO ILS UI
 * Copyright (C) 2021 RERO
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
import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';

@Component({
  selector: 'admin-dialog-import',
  templateUrl: './dialog-import.component.html'
})
export class DialogImportComponent {

  /** Available record */
  records: any[];

  /** Observable for action */
  confirmation$: Subject<boolean> = new Subject<boolean>();

  /**
   * Constructor
   * @param _bsModalRef - BsModalRef
   */
  constructor(private _bsModalRef: BsModalRef) {}

  /** Confirm action */
  confirm() {
    this.confirmation$.next(true);
    this.close();
  }

  /** Cancel action */
  decline() {
    this.confirmation$.next(false);
    this.close();
  }

  /** Close modal box */
  close() {
    this._bsModalRef.hide();
  }
}
