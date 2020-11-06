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

import { JoinPipe } from './join.pipe';

describe('Pipe: Joine', () => {
  it('create an instance', () => {
    const pipe = new JoinPipe();
    expect(pipe).toBeTruthy();
  });

  it('should return the same chain', () => {
    const pipe = new JoinPipe();
    expect(pipe.transform('foo')).toEqual('foo');
  });

  it('should return a chain separated by spaces (default separator)', () => {
    const pipe = new JoinPipe();
    expect(pipe.transform(['foo', 'bar'])).toEqual('foo bar');
  });

  it('should return a semicolon separated string', () => {
    const pipe = new JoinPipe();
    expect(pipe.transform(['foo', 'bar'], '; ')).toEqual('foo; bar');
  });
});
