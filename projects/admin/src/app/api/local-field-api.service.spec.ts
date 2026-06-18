// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { RecordService, RecordUiService } from '@rero/ng-core';
import { of } from 'rxjs';
import { LocalFieldApiService } from './local-field-api.service';

describe('LocalFieldApiService', () => {

  let localFieldApiService: LocalFieldApiService;

  const emptyRecords = {
    aggregations: {},
    hits: {
      total: {
        relation: 'eq',
        value: 0
      },
      hits: []
    },
    links: {}
  };

  const recordServiceSpy = { getRecords: vi.fn(), totalHits: vi.fn() };
  recordServiceSpy.getRecords.mockReturnValue(of(emptyRecords));
  recordServiceSpy.totalHits.mockReturnValue(0);

  const recordUiServiceSpy = { deleteRecord: vi.fn() };
  recordUiServiceSpy.deleteRecord.mockReturnValue(of(true));

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule
      ],
      providers: [
        LocalFieldApiService,
        { provide: RecordService, useValue: recordServiceSpy },
        { provide: RecordUiService, useValue: recordUiServiceSpy },
        provideHttpClient(),
        provideHttpClientTesting(),
      ]
    });
    localFieldApiService = TestBed.inject(LocalFieldApiService);
  });

  it('should create a service', () => {
    expect(localFieldApiService).toBeTruthy();
  });

  it('should return an empty object', () => {
    localFieldApiService.getByResourceTypeAndResourcePidAndOrganisationId('doc', '1', '1')
      .subscribe({
        next: (result) => expect('metadata' in result).toBeFalsy()
      });
  });

  it('should return true on the deletion of the record', () => {
    localFieldApiService.delete('1')
      .subscribe({
        next: (success: boolean) => expect(success).toBeTruthy()
      });
  });
});
