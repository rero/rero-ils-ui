/*
 * RERO ILS UI
 * Copyright (C) 2025 RERO
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
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { SafeUrlPipe } from './safe-url.pipe';

describe('MainTitlePipe', () => {
  let pipe: SafeUrlPipe;

  const domSanitizerSpy = class domSanitizer {
    bypassSecurityTrustResourceUrl(url: string) {
      return url;
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SafeUrlPipe,
        { provide: DomSanitizer, useClass: domSanitizerSpy }
      ],
      imports: [
        BrowserModule
      ]
    });

    pipe = TestBed.inject(SafeUrlPipe);
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return a valid url', () => {
    const url = 'https://localhost/pdf_viewer/pdf.pdf';
    expect(pipe.transform(url)).toEqual(url);
  });
});
