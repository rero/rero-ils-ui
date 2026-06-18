// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { TestBed } from "@angular/core/testing";
import { ItemTypeApiService } from "./item-type-api.service";
import { RecordService } from "@rero/ng-core";
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

  const recordServiceSpy = { getRecords: vi.fn() };
  recordServiceSpy.getRecords.mockReturnValue(of(response));

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot()
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
      expect(result).toHaveLength(2);
      expect('metadata' in result[0]).toBe(true);
    });
  });
});
