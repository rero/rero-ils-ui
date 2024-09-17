/*
 * RERO ILS UI
 * Copyright (C) 2023-2024 RERO
 * Copyright (C) 2023 UCLouvain
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
import { Component, inject, OnInit } from '@angular/core';
import { ItemApiService } from '@app/admin/api/item-api.service';
import { ITypeEmail } from '@app/admin/shared/preview-email/IPreviewInterface';
import { Tools } from '@app/admin/shared/preview-email/utils/tools';
import { NgCoreTranslateService, RecordService } from '@rero/ng-core';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'admin-issue-email',
  templateUrl: './issue-email.component.html'
})
export class IssueEmailComponent implements OnInit {

  private messageService = inject(MessageService);
  private dynamicDialogConfig: DynamicDialogConfig = inject(DynamicDialogConfig);
  private dynamicDialogRef: DynamicDialogRef = inject(DynamicDialogRef);
  private itemApiService: ItemApiService = inject(ItemApiService);
  private translateService: NgCoreTranslateService = inject(NgCoreTranslateService);
  private recordService: RecordService = inject(RecordService);

  record: any;

  /** Available recipient types */
  emailTypes = ['to', 'cc', 'bcc', 'reply_to'];

  /** Mandatory email types */
  mandatoryEmailTypes = ['to', 'reply_to'];

  /** Suggested emails and PrePopulate recipients */
  suggestions: { emails: string[], recipients: ITypeEmail[] } = { emails: [], recipients: []};

  /** Previewing the message body for the email */
  response: any;

  /** OnInit hook */
  ngOnInit(): void {
    this.record = this.dynamicDialogConfig.data.record;
    this.itemApiService.getPreviewByItemPid(this.record.metadata.pid)
      .subscribe((response: any) => {
        if (response.error) {
          this.messageService.add({
            severity: 'error',
            summary: this.translateService.instant('Claim'),
            detail: this.translateService.instant(`An error has occurred.<br><em>Error: ${response.error}</em>`),
            sticky: true,
            closable: true
          });
          this.closeDialog();
        } else {
          this.suggestions = Tools.processRecipientSuggestions(response.recipient_suggestions);
          this.response = response;
        }
      });
  }

  confirmIssue(recipients: ITypeEmail[]): void {
    this.itemApiService.addClaimIssue(this.record.metadata.pid, recipients).subscribe((result: boolean) => {
      if (result) {
        this.messageService.add({
          severity: 'success',
          summary: this.translateService.instant('Claim'),
          detail: this.translateService.instant('A new claim has been created.')
        });
        this.recordService
          .getRecord('items', this.record.metadata.pid, 1, {Accept: 'application/rero+json'})
          .subscribe((record: any) => this.closeDialog(record));
      } else {
        this.messageService.add({
          severity: 'error',
          summary: this.translateService.instant('Claim'),
          detail: this.translateService.instant('An error has occurred. Please try again.'),
          sticky: true,
          closable: true
        });
      }
    })
  }

  closeDialog(record?: any): void {
    this.dynamicDialogRef.close(record);
  }
}
