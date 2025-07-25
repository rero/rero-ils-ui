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
