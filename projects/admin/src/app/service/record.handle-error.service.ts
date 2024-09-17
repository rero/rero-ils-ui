/*
 * RERO ILS UI
 * Copyright (C) 2020-2023 RERO
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

  private messageService = inject(MessageService);

  /**
   * Constructor
   * @param translateService - TranslateService
   * @param spinner - NgxSpinnerService
   */
  constructor(
    protected translateService: TranslateService,
    private spinner: NgxSpinnerService
  ) {
    super(translateService);
  }

  /**
   * Http handle Error
   * @param error - Http Error Response
   * @param resourceName - Resource name
   * @returns Observable
   */
  handleError(error: HttpErrorResponse, resourceName?: string): Observable<never> {
    if (resourceName.startsWith('import_')) {
      this.messageService.add({
        severity: 'error',
        summary: this.translateService.instant('Import from the web'),
        detail: this.translateService.instant(
          'Your request to the external server has failed. Try again later ({{ statusCode }}).', {
            statusCode: error.status
        })
      });
      this.spinner.hide();
      return NEVER;
    } else {
      return this.standardHandleError(error);
    }
  }
}
