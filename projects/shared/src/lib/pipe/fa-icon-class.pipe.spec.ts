// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { TestBed } from '@angular/core/testing';
import { FaIconClassPipe } from './fa-icon-class.pipe';

describe('FaIconClassPipe', () => {
  let pipe: FaIconClassPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FaIconClassPipe
      ]
    });

    pipe = TestBed.inject(FaIconClassPipe);
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return the class of the pdf icon', () => {
    expect(pipe.transform('application/pdf', 'file')).toEqual('fa-file-pdf-o');
  });

  it('should return the icon class for an audio file', () => {
    expect(pipe.transform('audio/mpeg', 'file')).toEqual('fa-file-audio-o');
  });

  it('should return the default class', () => {
    expect(pipe.transform('application/page', 'file')).toEqual('fa-file-o');
  });
});
