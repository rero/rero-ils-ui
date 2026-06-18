// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { RecordHandleErrorService as CoreRecordHandleErrorService } from '@rero/ng-core';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { NEVER, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecordHandleErrorService extends CoreRecordHandleErrorService {

  private spinner: NgxSpinnerService = inject(NgxSpinnerService);
  private messageService = inject(MessageService);
  protected translateService: TranslateService = inject(TranslateService);

  /**
   * Http handle Error
   * @param error - Http Error Response
   * @param resourceName - Resource name
   * @returns Observable
   */
  handleError(error: HttpErrorResponse, resourceName?: string): Observable<never> {
    if (resourceName?.startsWith('import_')) {
      this.messageService.add({
        severity: 'error',
        summary: this.translateService.instant('Import from the web'),
        detail: this.translateService.instant(
          'Your request to the external server has failed. Try again later ({{ statusCode }}).', {
            statusCode: error.status
        }),
        sticky: true,
        closable: true
      });
      this.spinner.hide();
      return NEVER;
    } else {
      return this.standardHandleError(error);
    }
  }
}
