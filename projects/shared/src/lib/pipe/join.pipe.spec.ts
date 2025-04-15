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
import { JoinPipe } from './join.pipe';

describe('JoinPipe', () => {
  let pipe: JoinPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        JoinPipe
      ]
    });

    pipe = TestBed.inject(JoinPipe);
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return the same chain', () => {
    expect(pipe.transform('foo')).toEqual('foo');
  });

  it('should return a chain separated by spaces (default separator)', () => {
    expect(pipe.transform(['foo', 'bar'])).toEqual('foo bar');
  });

  it('should return a semicolon separated string', () => {
    expect(pipe.transform(['foo', 'bar'], '; ')).toEqual('foo; bar');
  });
});
