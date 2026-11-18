// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ApiService, RecordService } from '@rero/ng-core';

import { PatronService } from '../service/patron.service';
import { PatronNamePipe } from './patron-name.pipe';

describe('PatronNamePipe', () => {
  let pipe: PatronNamePipe;
  let httpTesting: HttpTestingController;

  /**
   * Look up the name of the patron 1, the API answering with the given response.
   * @param body - the response body
   * @param status - the response status
   * @returns the emitted names and the error, if any
   */
  function lookUp(body: object | null, status = 200): { names: string[]; error?: HttpErrorResponse } {
    const result: { names: string[]; error?: HttpErrorResponse } = { names: [] };
    pipe.transform('1').subscribe({
      next: (name: string) => result.names.push(name),
      error: (error: HttpErrorResponse) => (result.error = error),
    });
    httpTesting.expectOne('/api/patrons/1').flush(body, { status, statusText: `${status}` });
    return result;
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        PatronNamePipe,
        PatronService,
        { provide: ApiService, useValue: { getEndpointByType: (type: string) => `/api/${type}` } },
        { provide: RecordService, useValue: {} },
      ],
    });
    pipe = TestBed.inject(PatronNamePipe);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  it('should return the full name of the patron', () => {
    expect(lookUp({ metadata: { pid: '1', first_name: 'John', last_name: 'Doe' } }).names).toEqual(['Doe, John']);
  });

  it('should return an empty name for a deleted patron', () => {
    expect(lookUp({ status: 410, message: 'PID has been deleted.' }, 410)).toEqual({ names: [''] });
  });

  it('should return an empty name for a missing patron', () => {
    expect(lookUp({ status: 404, message: 'PID does not exist.' }, 404)).toEqual({ names: [''] });
  });

  it('should fail with any other error', () => {
    const { names, error } = lookUp(null, 500);
    expect(names).toEqual([]);
    expect(error.status).toBe(500);
  });
});
