/*
 * RERO ILS UI
 * Copyright (C) 2023 RERO
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
import { TestBed } from '@angular/core/testing';

import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RecordModule, RecordService } from '@rero/ng-core';
import { of } from 'rxjs';
import { IllRequestApiService } from './ill-request-api.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('IllRequestApiService', () => {
  let service: IllRequestApiService;

  const response = {
    "aggregations": {
    },
    "hits": {
      "hits": [
        {
          "created": "2023-04-25T06:40:01.498787+00:00",
          "id": "1",
          "links": {
            "self": "https://localhost:5000/api/ill_requests/1"
          },
          "metadata": {
            "$schema": "https://bib.rero.ch/schemas/ill_requests/ill_request-v0.0.1.json",
            "copy": false,
            "document": {
              "authors": "Aly Badr, Cairo University",
              "identifier": "9780123456789",
              "publisher": "Cairo University Press",
              "source": {
                "journal_title": "Mon titre de revue",
                "number": "1",
                "volume": "12"
              },
              "title": "Histoire d'Égypte",
              "year": "1920"
            },
            "found_in": {
              "source": "BGE",
              "url": "http://data.rero.ch/01-R007878671/html?view=GE_V1"
            },
            "library": {
              "pid": "1"
            },
            "notes": [
              {
                "content": "Une note prof",
                "type": "staff_note"
              },
              {
                "content": "Une note publique",
                "type": "public_note"
              }
            ],
            "organisation": {
              "pid": "1"
            },
            "patron": {
              "name": "Premand, Alain",
              "pid": "9",
              "type": "ptrn"
            },
            "pickup_location": {
              "name": "ILL AOSTE CANT1: Espaces publics",
              "pid": "1",
              "type": "loc"
            },
            "pid": "1",
            "status": "pending"
          },
          "updated": "2023-04-27T06:25:11.821222+00:00"
        }
      ],
      "total": {
        "relation": "eq",
        "value": 1
      }
    },
    "links": {}
  };

  const recordServiceSpy = jasmine.createSpyObj('RecordService', ['getRecords', 'totalHits']);
  recordServiceSpy.getRecords.and.returnValue(of(response));
  recordServiceSpy.totalHits.and.returnValue(1);

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [RecordModule,
        TranslateModule.forRoot()],
    providers: [
        { provide: RecordService, useValue: recordServiceSpy },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
    ]
});
    service = TestBed.inject(IllRequestApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should turn the records around', () => {
    service.getByPatronPid('9').subscribe((result: any) => {
      expect(result).toEqual(response.hits.hits);
    });
  });
});
