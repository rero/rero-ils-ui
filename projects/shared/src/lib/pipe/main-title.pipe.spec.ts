// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { TestBed } from '@angular/core/testing';
import { MainTitlePipe } from './main-title.pipe';

describe('MainTitlePipe', () => {
  let pipe: MainTitlePipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MainTitlePipe
      ]
    });

    pipe = TestBed.inject(MainTitlePipe);
  });

  const metadata = [{
    _text: 'document title',
    type: 'bf:Title'
  }];

  const metadataNoText = [{
    _text: 'document foo',
    type: 'bf:Foo'
  }];

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return a null value', () => {
    expect(pipe.transform(null)).toBeNull();
  });

  it('should return a title', () => {
    expect(pipe.transform(metadata)).toEqual('document title');
  });

  it('should return a null value (no key bf:Title)', () => {
    expect(pipe.transform(metadataNoText)).toBeNull();
  });
});
