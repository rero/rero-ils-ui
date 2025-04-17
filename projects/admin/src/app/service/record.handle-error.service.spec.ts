/*
 * RERO ILS UI
 * Copyright (C) 2025 RERO
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

import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { TestBed } from "@angular/core/testing";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { RecordModule } from "@rero/ng-core";
import { NgxSpinnerModule, NgxSpinnerService } from "ngx-spinner";
import { MessageService } from "primeng/api";
import { RecordHandleErrorService } from './record.handle-error.service';

describe('RecordHandleErrorService', () => {
  let service: RecordHandleErrorService;
  let messageService: MessageService;
  let translateService: TranslateService

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        NgxSpinnerModule.forRoot(),
        RecordModule
      ],
      providers: [
        RecordHandleErrorService,
        NgxSpinnerService,
        MessageService,
        TranslateService
      ]
    });

    service = TestBed.inject(RecordHandleErrorService);
    messageService = TestBed.inject(MessageService);
    translateService = TestBed.inject(TranslateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should raise an exception', () => {
    translateService.setTranslation('en', {
      'Your request to the external server has failed. Try again later ({{ statusCode }}).':
      'Your request to the external server has failed. Try again later ({{ statusCode }}).'
    })
    const httpResponse = new HttpErrorResponse({ status: HttpStatusCode.NotFound});
    const response = {status: 404, title: 'Not found'};
    const messageConfig = {
      severity: 'error',
      summary: 'Import from the web',
      detail: 'Your request to the external server has failed. Try again later (404).',
      sticky: true,
      closable: true
    }
    messageService.messageObserver.subscribe((value) => expect(value).toEqual(messageConfig));
    service.handleError(httpResponse, 'import_bnf').subscribe({
      error: (value: any) => expect(value).toEqual(response)
    });
  });
});
