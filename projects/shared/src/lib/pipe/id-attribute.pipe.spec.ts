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

import { TestBed } from '@angular/core/testing';
import { IdAttributePipe } from './id-attribute.pipe';

describe('IdAttributePipe', () => {
  let idAttributePipe: IdAttributePipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        IdAttributePipe
      ]
    });

    idAttributePipe = TestBed.inject(IdAttributePipe);
  });

  it('create an instance', () => {
    expect(idAttributePipe).toBeTruthy();
  });

  it('should return the field name', () => {
    expect(idAttributePipe.transform('my-field')).toEqual('my-field');
  });

  it('should return the field name with a prefix', () => {
    expect(
      idAttributePipe.transform('my-field', { prefix: 'foo' })
    ).toEqual('foo-my-field');
  });

  it('should return the field name with a suffix', () => {
    expect(
      idAttributePipe.transform('my-field', { suffix: 'foo' })
    ).toEqual('my-field-foo');
  });

  it('should return the field name with a prefix and suffix', () => {
    expect(
      idAttributePipe.transform('my-field', { prefix: 'foo', suffix: 'bar' })
    ).toEqual('foo-my-field-bar');
  });
});
