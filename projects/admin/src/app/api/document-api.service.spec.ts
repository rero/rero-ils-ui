/*
 * RERO ILS UI
 * Copyright (C) 2022 RERO
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
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RecordModule, RecordService } from '@rero/ng-core';
import { of } from 'rxjs';

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

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RecordModule,
        TranslateModule.forRoot()
      ]
    });
    service = TestBed.inject(DocumentApiService);
    recordService = TestBed.inject(RecordService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return the number of linked documents', () => {
    spyOn(recordService, 'getRecords').and.returnValue(of(response));
    service.getLinkedDocumentsCount('1').subscribe((result: any) => {
      expect(result).toEqual(2);
    });
  });

});
