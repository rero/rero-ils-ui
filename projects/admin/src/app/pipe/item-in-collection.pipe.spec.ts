/*
 * RERO ILS UI
 * Copyright (C) 2021 RERO
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
import { TranslateModule } from '@ngx-translate/core';
import { RecordModule, RecordService } from '@rero/ng-core';
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

  const recordServiceSpy = jasmine.createSpyObj('RecordService', ['getRecords', 'totalHits']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RecordModule,
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
    recordServiceSpy.getRecords.and.returnValue(of(emptyRecords));
    recordServiceSpy.totalHits.and.returnValue(0);
    pipe.transform('1').subscribe((result: any) => expect(result).toEqual([]));
  });

  it('should return an array of results', () => {
    recordServiceSpy.getRecords.and.returnValue(of(withRecords));
    recordServiceSpy.totalHits.and.returnValue(1);
    pipe.transform('1').subscribe((result: any) => expect(result).toEqual(records));
  });
});
