/*
 * RERO ILS UI
 * Copyright (C) 2022-2025 RERO
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
import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RecordService } from '@rero/ng-core';
import { AppConfigService } from '../service/app-config.service';
import { IAvailability } from '@rero/shared';
import { of } from 'rxjs';
import { IAdvancedSearchConfig } from '../record/search-view/document-advanced-search-form/i-advanced-search-config-interface';
import { DocumentApiService } from './document-api.service';

describe('DocumentApiService', () => {
  let service: DocumentApiService;
  let recordService: RecordService;

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

  const httpClientSpy = { get: vi.fn() };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: HttpClient, useValue: httpClientSpy },
        { provide: RecordService, useValue: { getRecords: vi.fn(), totalHits: vi.fn() } },
        { provide: AppConfigService, useValue: {} }
      ]
    });
    service = TestBed.inject(DocumentApiService);
    recordService = TestBed.inject(RecordService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
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
