// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { CoreConfigService, RecordService } from '@rero/ng-core';
import { of } from 'rxjs';
import { IAvailability } from '../interface/i-availability';
import { IAdvancedSearchConfig } from '../interface/i-advanced-search-config-interface';
import { DocumentApiService } from './document-api.service';

describe('DocumentApiService', () => {
  let service: DocumentApiService;
  let recordService: RecordService;

  const httpClientSpy = { get: vi.fn() };
  const recordServiceSpy = { getRecords: vi.fn() };

  const response = {
    aggregations: {},
    hits: {
      total: {
        relation: 'eq',
        value: 2
      },
      hits: [{
        metadata: {
          pid: 1
        }
      },
      {
        metadata: {
          pid: 2
        }
      }]
    },
    links: {}
  };

  const availability: IAvailability = {
    available: true
  }

  const advancedSearchConfig: IAdvancedSearchConfig = {
    fieldsConfig: [],
    fieldsData: {
      canton: [],
      country: [],
      rdaCarrierType: [],
      rdaContentType: [],
      rdaMediaType: [] }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useValue: httpClientSpy },
        { provide: RecordService, useValue: recordServiceSpy },
        { provide: CoreConfigService, useValue: {} }
      ]
    });
    service = TestBed.inject(DocumentApiService);
    recordService = TestBed.inject(RecordService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return whether full-text indexing is incomplete', () => {
    recordServiceSpy.getRecords.mockReturnValue(of({
      hits: {
        hits: [{ metadata: { fulltext_indexing_incomplete: true } }]
      }
    }));

    service.isFulltextIndexingIncomplete('1')
      .subscribe((response: boolean) => expect(response).toBe(true));

    expect(recordServiceSpy.getRecords).toHaveBeenCalledWith('documents', {
      query: 'pid:1',
      page: 1,
      itemsPerPage: 1
    });
  });

  it('should return the number of linked documents', () => {
    vi.spyOn(recordService, 'getRecords').mockReturnValue(of(response));
    service.getLinkedDocumentsCount('1').subscribe((result: any) => {
      expect(result).toEqual(2);
    });
  });

  it('should return the availability of the document', () => {
    httpClientSpy.get.mockReturnValue(of(availability));
    service.getAvailability('1')
      .subscribe((response: IAvailability) => expect(response).toEqual(availability));
  });

  it('should return the advanced search configuration ', () => {
    httpClientSpy.get.mockReturnValue(of(advancedSearchConfig));
    service.getAdvancedSearchConfig()
      .subscribe((config: IAdvancedSearchConfig) => expect(config).toEqual(advancedSearchConfig));
  });
});
