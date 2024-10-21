/*
 * RERO ILS UI
 * Copyright (C) 2021-2024 RERO
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
import { Component, inject, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CONFIG } from '@rero/ng-core';
import { MessageService } from 'primeng/api';
import { LoanApiService } from '../../../api/loan-api.service';
import { PatronProfileMenuService } from '../../patron-profile-menu.service';
import { PatronProfileService } from '../../patron-profile.service';

@Component({
  selector: 'public-search-patron-profile-request',
  templateUrl: './patron-profile-request.component.html',
  styleUrls: ['./patron-profile-request.component.scss']
})
export class PatronProfileRequestComponent {

  private loanApiService: LoanApiService = inject(LoanApiService);
  private translateService: TranslateService = inject(TranslateService);
  private patronProfileService: PatronProfileService = inject(PatronProfileService);
  private patronProfileMenuService: PatronProfileMenuService = inject(PatronProfileMenuService);
  private messageService: MessageService = inject(MessageService);

  /** Request record */
  @Input() record: any;

  /** Document section is collapsed */
  isCollapsed = true;

  /** Renew action done */
  actionDone = false;

  /** Cancel action success */
  actionSuccess = false;

  /** Cancel in progress */
  cancelInProgress = false;

  /** Get current viewcode */
  get viewcode(): string {
    return this.patronProfileMenuService.currentPatron.organisation.code;
  }

  /** Cancel a request */
  cancel(): void {
    const patronPid = this.patronProfileMenuService.currentPatron.pid;
    this.cancelInProgress = true;
    this.loanApiService.cancel({
      pid: this.record.metadata.pid,
      transaction_location_pid: this.record.metadata.item.location.pid,
      transaction_user_pid: patronPid
    }).subscribe((cancelLoan: any) => {
      if (cancelLoan !== undefined) {
        this.patronProfileService.cancelRequest(this.record.metadata.pid);
        this.actionDone = true;
        this.messageService.add({
          severity: 'success',
          summary: this.translateService.instant('Success'),
          detail: this.translateService.instant('The request has been cancelled.'),
          life: CONFIG.MESSAGE_LIFE
        });
      } else {
        this.cancelInProgress = false;
        this.messageService.add({
          severity: 'error',
          summary: this.translateService.instant('Error'),
          detail: this.translateService.instant('Error during the cancellation of the request.'),
          sticky: true,
          closable: true
        });
      }
    });
  }
}
