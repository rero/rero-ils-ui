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
import { GetTranslatedLabelPipe } from './get-translated-label.pipe';

describe('GetTranslatedLabelPipe', () => {

  const entries = [
    {language: 'fr', label: 'mon étiquette'},
    {language: 'en', label: 'my label'},
    {language: 'it', label: 'la mia etichetta'}
  ];

  const translateServiceSpy = jasmine.createSpyObj('TranslateService', ['']);
  translateServiceSpy.currentLang = 'en';

  let getTranslatedLabelPipe: GetTranslatedLabelPipe;
  let translateService: TranslateService;


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot()
      ],
      providers: [
        GetTranslatedLabelPipe,
        { provide: TranslateService, useValue: translateServiceSpy }
      ]
    });
    getTranslatedLabelPipe = TestBed.inject(GetTranslatedLabelPipe);
    translateService = TestBed.inject(TranslateService);
  });


  it('found french label', () => {
    translateService.currentLang = 'fr';
    expect(
      getTranslatedLabelPipe.transform(entries)
    ).toEqual('mon étiquette');
  });
  it('found english label', () => {
    translateService.currentLang = 'fr';
    expect(
      getTranslatedLabelPipe.transform(entries, 'en')
    ).toEqual('my label');
  });
  it('found german label', () => {
    translateService.currentLang = 'de';
    expect(
      getTranslatedLabelPipe.transform(entries)
    ).toEqual('mon étiquette');
  });
  it('found unknown label', () => {
    translateService.currentLang = 'fr';
    expect(
      getTranslatedLabelPipe.transform(undefined)
    ).toEqual(null);
  });
});
