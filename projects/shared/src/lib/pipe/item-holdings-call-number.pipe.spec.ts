/*
 * RERO ILS UI
 * Copyright (C) 2020-2025 RERO
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

import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RecordService } from '@rero/ng-core';
import { Observable, of } from 'rxjs';
import { ItemHoldingsCallNumberPipe } from './item-holdings-call-number.pipe';

describe('ItemHoldingsCallNumberPipe', () => {

  let pipe: ItemHoldingsCallNumberPipe;
  let recordService: RecordService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot()
      ],
    providers: [
        ItemHoldingsCallNumberPipe,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
});
    pipe = TestBed.inject(ItemHoldingsCallNumberPipe);
    recordService = TestBed.inject(RecordService);
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return call numbers without calling the api', () => {
    const record = {
      metadata: {
        call_number: 'first call number',
        second_call_number: 'second call number'
      }
    };
    const output = {
      first: {
        source: 'item',
        value: record.metadata.call_number
      },
      second: {
        source: 'item',
        value: record.metadata.second_call_number
      }
    };
    expect(pipe.transform(record)).toBeInstanceOf(Observable);
    pipe.transform(record).subscribe((result: any) => {
      expect(result).toEqual(output);
    });
  });

  it('should return call number undefined', () => {
    spyOn(recordService, 'getRecord').and.returnValue(of({
      metadata: {}
    }));
    const record = {
      metadata: {
        holding: {
          pid: '1'
        }
      }
    };
    const output = {
      first: {
        source: undefined,
        value: undefined
      },
      second: {
        source: undefined,
        value: undefined
      }
    };
    expect(pipe.transform(record)).toBeInstanceOf(Observable);
    pipe.transform(record).subscribe((result: any) => {
      expect(result).toEqual(output);
    });
  });

  it('should return call numbers with calling the api', () => {
    const apiRecord = {
      metadata: {
        call_number: 'M call number'
      }
    };
    spyOn(recordService, 'getRecord').and.returnValue(of(apiRecord));
    const record = {
      metadata: {
        holding: {
          pid: '1'
        },
        second_call_number: apiRecord.metadata.call_number
      }
    };
    const output = {
      first: {
        source: 'holding',
        value: 'M call number'
      },
      second: {
        source: 'item',
        value: record.metadata.second_call_number
      }
    };
    expect(pipe.transform(record)).toBeInstanceOf(Observable);
    pipe.transform(record).subscribe((result: any) => {
      expect(result).toEqual(output);
    });
  });
});
