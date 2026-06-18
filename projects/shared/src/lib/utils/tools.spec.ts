// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Tools } from './tools';

describe('Tools', () => {
  it('should validate an email address', () => {
    expect(Tools.validateEmail('foo')).toBe(false);
    expect(Tools.validateEmail('foo@bar')).toBe(false);
    expect(Tools.validateEmail('foo@bar.com')).toBe(true);
  });

  it('should return the currency symbol according to language', () => {
    expect(Tools.currencySymbol('fr', 'EUR')).toEqual('€');
    expect(Tools.currencySymbol('en', 'USD')).toEqual('$');
  });
});

