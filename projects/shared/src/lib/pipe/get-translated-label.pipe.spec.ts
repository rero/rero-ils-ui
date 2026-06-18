// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { GetTranslatedLabelPipe } from './get-translated-label.pipe';

describe('GetTranslatedLabelPipe', () => {

  const entries = [
    {language: 'fr', label: 'mon étiquette'},
    {language: 'en', label: 'my label'},
    {language: 'it', label: 'la mia etichetta'}
  ];

  const entriesDefault = [
    {language: 'default', label: 'on_shelf'}
  ];

  let getTranslatedLabelPipe: GetTranslatedLabelPipe;
  let translateService: TranslateService;


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot()
      ],
      providers: [
        GetTranslatedLabelPipe
      ]
    });
    getTranslatedLabelPipe = TestBed.inject(GetTranslatedLabelPipe);
    translateService = TestBed.inject(TranslateService);
  });


  it('found french label', () => {
    vi.spyOn(translateService, 'currentLang', 'get').mockReturnValue('fr');
    expect(
      getTranslatedLabelPipe.transform(entries)
    ).toEqual('mon étiquette');
  });
  it('found english label', () => {
    vi.spyOn(translateService, 'currentLang', 'get').mockReturnValue('fr');
    expect(
      getTranslatedLabelPipe.transform(entries, 'en')
    ).toEqual('my label');
  });
  it('found german label', () => {
    vi.spyOn(translateService, 'currentLang', 'get').mockReturnValue('de');
    expect(
      getTranslatedLabelPipe.transform(entries)
    ).toEqual('mon étiquette');
  });
  it('found unknown label', () => {
    vi.spyOn(translateService, 'currentLang', 'get').mockReturnValue('fr');
    expect(
      getTranslatedLabelPipe.transform(undefined)
    ).toEqual(null);
  });

  it('found default value', () => {
    translateService.setTranslation('fr', { on_shelf : 'en rayon' });
    translateService.use('fr');
    expect(
      getTranslatedLabelPipe.transform(entriesDefault)
    ).toEqual('en rayon');
  });
});
