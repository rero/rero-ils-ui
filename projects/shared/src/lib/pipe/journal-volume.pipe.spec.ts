// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { JournalVolumePipe } from './journal-volume.pipe';

describe('JournalVolumePipe', () => {
  let pipe: JournalVolumePipe;
  let translate: TranslateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot()
      ],
      providers: [
        JournalVolumePipe
      ]
    });
    translate = TestBed.inject(TranslateService);
    pipe = TestBed.inject(JournalVolumePipe);

    translate.setTranslation('fr', {
      'Vol. {{ volume }}': 'Volume {{ volume }}',
      'n°. {{ number }}': 'n°. {{ number }}'
    });
    translate.use('fr');
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return the volume', () => {
    expect(pipe.transform({ volume: '12' })).toContain('Volume 12');
  });

  it('should return the number', () => {
    expect(pipe.transform({ number: '20' })).toContain('n°. 20');
  });

  it('should return the volume and the number', () => {
    expect(pipe.transform({ volume: '12', number: '20' })).toContain('Volume 12 — n°. 20');
  });

  it('should return the volume and the number with custom separator', () => {
    expect(pipe.transform({ volume: '12', number: '20' }, ' // ')).toContain('Volume 12 // n°. 20');
  });
});
