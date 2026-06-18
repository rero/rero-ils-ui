// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

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
