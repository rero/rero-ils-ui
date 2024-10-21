/*
 * RERO ILS UI
 * Copyright (C) 2022-2024 RERO
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
import { inject, Injectable } from '@angular/core';
import { IssueItemStatus } from '@rero/shared';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IssueEmailComponent } from '../components/issues/issue-email/issue-email.component';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class IssueService {

  private dialogService: DialogService = inject(DialogService);
  private translateService: TranslateService = inject(TranslateService);

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
   * Open a claim dialog
   * @param record the item
   * @return DynamicDialogRef
   */
  openClaimEmailDialog(record: any): DynamicDialogRef {
    return this.dialogService.open(IssueEmailComponent, {
      header: this.translateService.instant('Claim'),
      width: '60vw',
      dismissableMask: true,
      data: { record }
    });
  }
}
