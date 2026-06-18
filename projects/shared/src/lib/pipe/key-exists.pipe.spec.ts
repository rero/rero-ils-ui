// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { TestBed } from '@angular/core/testing';
import { KeyExistsPipe } from './key-exists.pipe';

describe('KeyExistsPipe', () => {
  let pipe: KeyExistsPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        KeyExistsPipe
      ]
    });

    pipe = TestBed.inject(KeyExistsPipe);
  });

  const record = {
    foo: 'bar'
  };

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


