// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
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
