/*
 * RERO ILS UI
 * Copyright (C) 2023-2025 RERO
 * Copyright (C) 2023 UCLouvain
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
import { Tools } from './tools';

describe('Tools', () => {
  it('should validate an email address', () => {
    expect(Tools.validateEmail('foo')).toBeFalse();
    expect(Tools.validateEmail('foo@bar')).toBeFalse();
    expect(Tools.validateEmail('foo@bar.com')).toBeTrue();
  });

  it('should return the currency symbol according to language', () => {
    expect(Tools.currencySymbol('fr', 'EUR')).toEqual('€');
    expect(Tools.currencySymbol('en', 'USD')).toEqual('$');
  });
});

