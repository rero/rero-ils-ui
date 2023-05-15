/*
 * RERO ILS UI
 * Copyright (C) 2022-2023 RERO
 * Copyright (C) 2022-2023 UCLouvain
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
import { Injectable } from '@angular/core';
import { IssueItemStatus } from '@rero/shared';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { IssueEmailComponent } from '../components/issues/issue-email/issue-email.component';

@Injectable()
export class IssueService {

  /**
   * Constructor
   * @param _modalService - BsModalService
   */
  constructor(private _modalService: BsModalService) { }

  /**
   * Is Allow claim
   * @param status - status of item issue
   * @returns true if the status is concerned
   */
  isClaimAllowed(status: any): boolean {
    return [
      IssueItemStatus.EXPECTED,
      IssueItemStatus.LATE,
    ].includes(status);
  }

  /**
   * Opens a claim dialog
   * @param record the item
   * @returns BsModalRef
   */
  openClaimEmailDialog(record: any): BsModalRef {
    const bsModalRef = this._modalService.show(IssueEmailComponent, {
      ignoreBackdropClick: true,
      keyboard: true,
      class: 'modal-xl',
      initialState: { record }
    });
    // Event to allow the closing of the dialog
    bsModalRef.content.closeDialog.subscribe((close: boolean) => bsModalRef.hide());
    return bsModalRef;
  }
}
