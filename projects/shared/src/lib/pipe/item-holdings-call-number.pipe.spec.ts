/*
 * RERO ILS UI
 * Copyright (C) 2020 RERO
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

import { ItemHoldingsCallNumberPipe } from './item-holdings-call-number.pipe';
import { of } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RecordService } from '@rero/ng-core';

describe('ItemHoldingsCallNumberPipe', () => {

  let itemHoldingsCallNumberPipe: ItemHoldingsCallNumberPipe;

  const recordServiceSpy = jasmine.createSpyObj('RecordService', ['getRecord']);
  recordServiceSpy.getRecord.and.returnValue(of({}));

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        ItemHoldingsCallNumberPipe,
        { provide: RecordService, useValue: recordServiceSpy }
      ]
    });
    itemHoldingsCallNumberPipe = TestBed.inject(ItemHoldingsCallNumberPipe);
  });

  it('create an instance', () => {
    expect(itemHoldingsCallNumberPipe).toBeTruthy();
  });
});
