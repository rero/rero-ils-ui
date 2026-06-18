// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ArrayTranslatePipe } from './array-translate.pipe';

describe('ArrayTranslatePipe', () => {
  let pipe: ArrayTranslatePipe;

  const translateServiceSpy = { instant: vi.fn().mockReturnValue('foobar') };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot()
      ],
      providers: [
        ArrayTranslatePipe,
        { provide: TranslateService, useValue: translateServiceSpy }
      ]
    });
    pipe = TestBed.inject(ArrayTranslatePipe);
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should translate the strings in the array', () => {
    expect(pipe.transform(['foo', 'bar'])).toEqual(['foobar', 'foobar']);
  });
});
