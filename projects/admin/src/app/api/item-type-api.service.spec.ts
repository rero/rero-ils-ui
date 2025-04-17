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
import { ItemTypeApiService } from "./item-type-api.service";
import { RecordModule, RecordService } from "@rero/ng-core";
import { of } from "rxjs";
import { TranslateModule } from "@ngx-translate/core";

describe('ItemTypeApiService', () => {
  let service: ItemTypeApiService;

  const itemTypes = [
    {
      metadata: {
        pid: 1,
        name: 'In acquisition',
        negative_availability: true,
        type: 'standard'
      }
    },
    {
      metadata: {
        pid: 2,
        name: 'Missing',
        negative_availability: true,
        type: 'standard'
      }
    }
  ];

  const response = {
    aggregations: {},
    hits: {
      total: {
        relation: 'eq',
        value: 1
      },
      hits: itemTypes
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
        ItemTypeApiService,
        { provide: RecordService, useValue: recordServiceSpy }
      ]
    });

    service = TestBed.inject(ItemTypeApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a list of item types', () => {
    service.getAll().subscribe((result: any[]) => {
      expect(result).toHaveSize(2);
      expect('metadata' in result[0]).toBeTrue();
    });
  });
});
