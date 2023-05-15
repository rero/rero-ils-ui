/*
 * RERO ILS UI
 * Copyright (C) 2023 RERO
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
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ItemApiService } from '@app/admin/api/item-api.service';
import { ITypeEmail } from '@app/admin/shared/preview-email/IPreviewInterface';
import { Tools } from '@app/admin/shared/preview-email/utils/tools';
import { TranslateService } from '@ngx-translate/core';
import { RecordService } from '@rero/ng-core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'admin-issue-email',
  templateUrl: './issue-email.component.html'
})
export class IssueEmailComponent implements OnInit {

  /** Item */
  @Input() record: any;

  /** Closing event for the modal dialog */
  @Output() closeDialog = new EventEmitter<boolean>(false);

  /** Reload data event to enable detection of data loading */
  @Output() recordChange = new EventEmitter<any>();

  /** Available recipient types */
  emailTypes = ['to', 'cc', 'bcc', 'reply_to'];

  /** Mandatory email types */
  mandatoryEmailTypes = ['to', 'reply_to'];

  /** Suggested emails and PrePopulate recipients */
  suggestions: { emails: string[], recipients: ITypeEmail[] } = { emails: [], recipients: []};

  /** Previewing the message body for the email */
  response: any;

  /**
   * Constructor
   * @param _itemApiService - ItemApiService
   * @param _toastrService - ToastrService
   * @param _translateService - TranslateService
   * @param _recordService - RecordService
   */
  constructor(
    private _itemApiService: ItemApiService,
    private _toastrService: ToastrService,
    private _translateService: TranslateService,
    private _recordService: RecordService
  ) { }

  /** OnInit hook */
  ngOnInit(): void {
    this._itemApiService.getPreviewByItemPid(this.record.metadata.pid)
      .subscribe((response: any) => {
        if (response.error) {
          this._toastrService.error(
            this._translateService.instant(`An error has occurred.<br><em>Error: ${response.error}</em>`),
          this._translateService.instant('Claim'),
          { enableHtml: true, disableTimeOut: true }
          );
          this.closeEmailDialog();
        } else {
          this.suggestions = Tools.processRecipientSuggestions(response.recipient_suggestions);
          this.response = response;
        }
      });
  }

  confirmIssue(recipients: ITypeEmail[]): void {
    this._itemApiService.addClaimIssue(this.record.metadata.pid, recipients).subscribe((result: boolean) => {
      if (result) {
        this._toastrService.success(
          this._translateService.instant('A new claim has been created.'),
          this._translateService.instant('Claim')
        );
        this.closeEmailDialog();
        this._recordService
          .getRecord('items', this.record.metadata.pid, 1, {Accept: 'application/rero+json'})
          .subscribe((record: any) => this.recordChange.emit(record));
      } else {
        this._toastrService.error(
          this._translateService.instant('An error has occurred. Please try again.'),
          this._translateService.instant('Claim'),
          { disableTimeOut: true }
        );
      }
    })
  }

  /**
   * Close email dialog
   * Send the event to trigger the closing of the dialog
   * from the child to the parent
   */
  closeEmailDialog(): void {
    this.closeDialog.emit(true);
  }
}
