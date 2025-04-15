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
import { MainTitlePipe } from './main-title.pipe';

describe('MainTitlePipe', () => {
  let pipe: MainTitlePipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MainTitlePipe
      ]
    });

    pipe = TestBed.inject(MainTitlePipe);
  });

  const metadata = [{
    _text: 'document title',
    type: 'bf:Title'
  }];

  const metadataNoText = [{
    _text: 'document foo',
    type: 'bf:Foo'
  }];

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return a null value', () => {
    expect(pipe.transform(null)).toBeNull();
  });

  it('should return a title', () => {
    expect(pipe.transform(metadata)).toEqual('document title');
  });

  it('should return a null value (no key bf:Title)', () => {
    expect(pipe.transform(metadataNoText)).toBeNull();
  });
});
