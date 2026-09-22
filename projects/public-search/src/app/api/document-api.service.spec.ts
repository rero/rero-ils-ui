// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { RecordService } from '@rero/ng-core';
import { IAvailability } from '@rero/shared';
import { of } from 'rxjs';
import { DocumentApiService } from './document-api.service';

describe('DocumentApiService', () => {
  let service: DocumentApiService;

  const httpClientSpy = { get: vi.fn() };
  const recordServiceSpy = { getRecord: vi.fn() };

  const availability: IAvailability = {
    available: true
  }

  const availabilityView: IAvailability = {
    available: false
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
    providers: [
      { provide: HttpClient, useValue: httpClientSpy },
      { provide: RecordService, useValue: recordServiceSpy }
    ]
});
    service = TestBed.inject(DocumentApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should request the document with the rero+json representation', () => {
    const record = { metadata: { pid: '1' } };
    recordServiceSpy.getRecord.mockReturnValue(of(record));
    service.getDocument('1').subscribe((response) => expect(response).toEqual(record));
    expect(recordServiceSpy.getRecord).toHaveBeenCalledWith(
      'documents', '1', { resolve: 1, headers: { Accept: 'application/rero+json' } });
  });

  it('should return the availability of the document', () => {
    httpClientSpy.get.mockReturnValue(of(availability));
    service.getAvailability('1')
      .subscribe((response: IAvailability) => expect(response).toEqual(availability));
  });

  it('should return the availability of the document from current view', () => {
    httpClientSpy.get.mockReturnValue(of(availabilityView));
    service.getAvailability('1', 'aoste')
      .subscribe((response: IAvailability) => expect(response).toEqual(availabilityView));
  });
});
