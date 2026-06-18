// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

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
