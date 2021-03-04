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
import { KeyExistsPipe } from './key-exists.pipe';

describe('KeyExistsPipe', () => {
  let pipe: KeyExistsPipe;

  const record = {
    foo: 'bar'
  };

  beforeEach(() => {
    pipe = new KeyExistsPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return false because the field does not exist', () => {
    expect(pipe.transform(record, 'bar')).toBeFalsy();
  });

  it('should return true because the field exists', () => {
    expect(pipe.transform(record, 'foo')).toBeTruthy();
  });
});


