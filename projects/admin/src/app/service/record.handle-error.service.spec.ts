// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { MessageService } from '@openng/optimus-ui/api';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

import { RecordHandleErrorService } from './record.handle-error.service';

describe('RecordHandleErrorService', () => {
  let service: RecordHandleErrorService;
  let messageService: MessageService;
  let translateService: TranslateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxSpinnerModule.forRoot()],
      providers: [provideTranslateService(), RecordHandleErrorService, NgxSpinnerService, MessageService],
    });

    service = TestBed.inject(RecordHandleErrorService);
    messageService = TestBed.inject(MessageService);
    translateService = TestBed.inject(TranslateService);
    translateService.setFallbackLang('en');
    translateService.use('en');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should raise an exception', () => {
    translateService.setTranslation('en', {
      'Your request to the external server has failed. Try again later ({{ statusCode }}).':
        'Your request to the external server has failed. Try again later ({{ statusCode }}).',
    });
    const httpResponse = new HttpErrorResponse({ status: HttpStatusCode.NotFound });
    const response = { status: 404, title: 'Not found' };
    const messageConfig = {
      severity: 'error',
      summary: 'Import from the web',
      detail: 'Your request to the external server has failed. Try again later (404).',
      sticky: true,
      closable: true,
    };
    messageService.messageObserver.subscribe((value) => expect(value).toEqual(messageConfig));
    service.handleError(httpResponse, 'import_bnf').subscribe({
      error: (value: any) => expect(value).toEqual(response),
    });
  });
});
