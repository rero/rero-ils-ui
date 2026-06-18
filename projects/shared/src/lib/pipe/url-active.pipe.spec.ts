// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { TestBed } from '@angular/core/testing';
import { UrlActivePipe } from './url-active.pipe';

describe('Pipe: UrlActivee', () => {
  let urlActivePipe: UrlActivePipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UrlActivePipe
      ]
    });

    urlActivePipe = TestBed.inject(UrlActivePipe);
  });

  const text = 'A text with a link http://www.rero.ch';

  const textResult =
  'A text with a link <a href="http://www.rero.ch" target="_self">http://www.rero.ch</a>';

  const textResultBlank =
  'A text with a link <a href="http://www.rero.ch" target="_blank">http://www.rero.ch</a>';

  it('create an instance', () => {
    expect(urlActivePipe).toBeTruthy();
  });

  it('should transform the url', () => {
    expect(urlActivePipe.transform(text)).toEqual(textResult);
  });

  it('should transform the url with target _blank', () => {
    expect(urlActivePipe.transform(text, '_blank')).toEqual(textResultBlank);
  });
});
