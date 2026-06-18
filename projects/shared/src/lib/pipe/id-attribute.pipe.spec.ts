// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

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
