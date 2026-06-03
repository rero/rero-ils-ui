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

import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RecordService } from '@rero/ng-core';
import { firstValueFrom, of } from 'rxjs';
import { skip } from 'rxjs/operators';
import { ItemHoldingsCallNumberPipe } from './item-holdings-call-number.pipe';

describe('ItemHoldingsCallNumberPipe', () => {

  let pipe: ItemHoldingsCallNumberPipe;

  const recordServiceSpy = { getRecord: vi.fn() };

  beforeEach(() => {
    recordServiceSpy.getRecord.mockReset();
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot()
      ],
      providers: [
        ItemHoldingsCallNumberPipe,
        { provide: RecordService, useValue: recordServiceSpy }
      ]
    });
    pipe = TestBed.inject(ItemHoldingsCallNumberPipe);
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return call numbers without calling the api', async () => {
    const record = {
      metadata: {
        call_number: 'first call number',
        second_call_number: 'second call number'
      }
    };
    const output = {
      first: {
        source: 'item' as const,
        value: record.metadata.call_number
      },
      second: {
        source: 'item' as const,
        value: record.metadata.second_call_number
      }
    };
    expect(await firstValueFrom(pipe.transform(record))).toEqual(output);
    expect(recordServiceSpy.getRecord).not.toHaveBeenCalled();
  });

  it('should return call number undefined', async () => {
    recordServiceSpy.getRecord.mockReturnValue(of({ metadata: {} }));
    const record = {
      metadata: {
        holding: { pid: '1' }
      }
    };
    const output = {
      first: { source: undefined, value: undefined },
      second: { source: undefined, value: undefined }
    };
    expect(await firstValueFrom(pipe.transform(record).pipe(skip(1)))).toEqual(output);
  });

  it('should return call numbers with calling the api', async () => {
    recordServiceSpy.getRecord.mockReturnValue(of({ metadata: { call_number: 'M call number' } }));
    const record = {
      metadata: {
        holding: { pid: '1' },
        second_call_number: 'M call number'
      }
    };
    const output = {
      first: { source: 'holding' as const, value: 'M call number' },
      second: { source: 'item' as const, value: record.metadata.second_call_number }
    };

    expect(await firstValueFrom(pipe.transform(record))).toEqual({
      first: { source: undefined, value: undefined },
      second: { source: undefined, value: undefined }
    });

    expect(await firstValueFrom(pipe.transform(record).pipe(skip(1)))).toEqual(output);
    expect(recordServiceSpy.getRecord).toHaveBeenCalledTimes(2);
    expect(recordServiceSpy.getRecord).toHaveBeenCalledWith('holdings', '1', { resolve: 1 });
  });
});
