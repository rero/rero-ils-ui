/*
 * RERO ILS UI
 * Copyright (C) 2021 RERO
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
    expect(pipe.transform({ volume: '12', number: '20' })).toContain('Volume 12 &mdash; n°. 20');
  });

  it('should return the volume and the number with custom separator', () => {
    expect(pipe.transform({ volume: '12', number: '20' }, ' // ')).toContain('Volume 12 // n°. 20');
  });
});
