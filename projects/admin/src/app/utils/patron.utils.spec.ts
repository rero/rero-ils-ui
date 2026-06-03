/*
 * RERO ILS UI
 * Copyright (C) 2019-2026 RERO
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
import { formatPatronName } from './patron.utils';

describe('formatPatronName', () => {
  it('should return "last_name, first_name" when both are present', () => {
    expect(formatPatronName({ last_name: 'Doe', first_name: 'John' })).toBe('Doe, John');
  });

  it('should return only last_name when first_name is absent', () => {
    expect(formatPatronName({ last_name: 'Doe' })).toBe('Doe');
  });

  it('should return only first_name when last_name is absent', () => {
    expect(formatPatronName({ first_name: 'John' })).toBe('John');
  });

  it('should return empty string when both names are absent', () => {
    expect(formatPatronName({})).toBe('');
  });

  it('should trim whitespace from each name part', () => {
    expect(formatPatronName({ last_name: '  Doe  ', first_name: '  John  ' })).toBe('Doe, John');
  });

  it('should treat empty string as absent (falsy)', () => {
    expect(formatPatronName({ last_name: '', first_name: 'John' })).toBe('John');
    expect(formatPatronName({ last_name: 'Doe', first_name: '' })).toBe('Doe');
    expect(formatPatronName({ last_name: '', first_name: '' })).toBe('');
  });
});
