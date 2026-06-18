// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
import { inject, Injectable } from '@angular/core';
import { IssueItemStatus } from '@rero/shared';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IssueEmailComponent } from '../components/issues/issue-email/issue-email.component';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
   providedIn: 'root'
})
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
      modal: true,
      closable: true,
      width: '90vw',
      data: { record }
    });
  }
}
