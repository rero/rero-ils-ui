// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RecordService } from '@rero/ng-core';
import { of } from 'rxjs';
import { ItemInCollectionPipe } from './item-in-collection.pipe';

describe('ItemInCollectionPipe', () => {
  let pipe: ItemInCollectionPipe;

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

  const records = [{ pid: '1'}];

  const withRecords = {
    aggregations: {},
    hits: {
      total: {
        relation: 'eq',
        value: 1
      },
      hits: records
    },
    links: {}
  };

  const recordServiceSpy = { getRecords: vi.fn(), totalHits: vi.fn() };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot()
      ],
      providers: [
        ItemInCollectionPipe,
        { provide: RecordService, useValue: recordServiceSpy }
      ]
    });
    pipe = TestBed.inject(ItemInCollectionPipe);
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return a null value if no result', () => {
    recordServiceSpy.getRecords.mockReturnValue(of(emptyRecords));
    recordServiceSpy.totalHits.mockReturnValue(0);
    pipe.transform('1').subscribe((result: any) => expect(result).toEqual([]));
  });

  it('should return an array of results', () => {
    recordServiceSpy.getRecords.mockReturnValue(of(withRecords));
    recordServiceSpy.totalHits.mockReturnValue(1);
    pipe.transform('1').subscribe((result: any) => expect(result).toEqual(records));
  });
});
