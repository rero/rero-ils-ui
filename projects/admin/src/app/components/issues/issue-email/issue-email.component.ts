// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ItemApiService } from '@app/admin/api/item-api.service';
import { IPreview, ISuggestions, ITypeEmail } from '@app/admin/shared/preview-email/IPreviewInterface';
import { Tools } from '@app/admin/shared/preview-email/utils/tools';
import { CONFIG, NgCoreTranslateService, RecordService } from '@rero/ng-core';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PreviewEmailComponent } from '../../../shared/preview-email/component/preview-email/preview-email.component';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { Message } from 'primeng/message';

@Component({
  selector: 'admin-issue-email',
  templateUrl: './issue-email.component.html',
  imports: [PreviewEmailComponent, TranslateDirective, TranslatePipe, Message],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IssueEmailComponent {

  private messageService: MessageService = inject(MessageService);
  private dynamicDialogConfig: DynamicDialogConfig = inject(DynamicDialogConfig);
  private dynamicDialogRef: DynamicDialogRef = inject(DynamicDialogRef);
  private itemApiService: ItemApiService = inject(ItemApiService);
  private translateService: NgCoreTranslateService = inject(NgCoreTranslateService);
  private recordService: RecordService = inject(RecordService);

  private record = this.dynamicDialogConfig.data.record;

  /** Available recipient types */
  readonly emailTypes = ['to', 'cc', 'bcc', 'reply_to'];

  /** Mandatory email types */
  readonly mandatoryEmailTypes = ['to', 'reply_to'];

  /** Suggested emails and pre-populated recipients */
  suggestions = signal<ISuggestions>({ emails: [], recipients: [] });

  /** Previewing the message body for the email */
  response = signal<IPreview | null>(null);

  constructor() {
    this.itemApiService.getPreviewByItemPid(this.record.metadata.pid)
      .subscribe({
        next: (data: IPreview & { error?: string }) => {
          if (data.error) {
            this.closeDialog(this.record);
            this.messageService.add({
              severity: 'error',
              summary: this.translateService.instant('Claim'),
              detail: this.translateService.instant(`An error has occurred.<br><em>Error: ${data.error}</em>`),
              sticky: true,
              closable: true
            });
          } else {
            this.suggestions.set(Tools.processRecipientSuggestions(data.recipient_suggestions));
            this.response.set(data);
          }
        },
        error: () => this.messageService.add({
          severity: 'error',
          summary: this.translateService.instant('Claim'),
          detail: this.translateService.instant('An error has occurred'),
          sticky: true,
          closable: true
        })
      });
  }

  confirmIssue(recipients: ITypeEmail[]): void {
    this.itemApiService.addClaimIssue(this.record.metadata.pid, recipients).subscribe((result: boolean) => {
      if (result) {
        this.messageService.add({
          severity: 'success',
          summary: this.translateService.instant('Claim'),
          detail: this.translateService.instant('A new claim has been created.'),
          life: CONFIG.MESSAGE_LIFE
        });
        this.recordService
          .getRecord('items', this.record.metadata.pid, { resolve: 1, headers: { Accept: 'application/rero+json' } })
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
    });
  }

  closeDialog(record?: any): void {
    this.dynamicDialogRef.close(record);
  }
}
