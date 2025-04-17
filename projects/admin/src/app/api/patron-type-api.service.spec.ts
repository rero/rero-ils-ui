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

import { TestBed } from "@angular/core/testing";
import { PatronTypeApiService } from "./patron-type-api.service";
import { RecordModule, RecordService } from "@rero/ng-core";
import { TranslateModule } from "@ngx-translate/core";
import { of } from "rxjs";

describe('PatronTypeApiService', () => {
  let service: PatronTypeApiService;

  const response = {
    aggregations: {},
    hits: {
      total: {
        relation: 'eq',
        value: 1
      },
      hits: [
        {
          metadata: {
            pid: 1,
            name: 'Children',
            description: 'Children'
          }
        }
      ]
    },
    links: {}
  };

  const recordServiceSpy = jasmine.createSpyObj('RecordService', ['getRecords']);
  recordServiceSpy.getRecords.and.returnValue(of(response));

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        RecordModule
      ],
      providers: [
        PatronTypeApiService,
        { provide: RecordService, useValue: recordServiceSpy }
      ]
    });

    service = TestBed.inject(PatronTypeApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a list of patron types', () => {
    service.getAll()
      .subscribe((result: any[]) => expect(result).toEqual(response.hits.hits));
  });
});
