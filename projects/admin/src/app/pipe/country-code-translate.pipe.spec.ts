// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { TestBed } from "@angular/core/testing";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { CountryCodeTranslatePipe } from "./country-code-translate.pipe";

describe('CountryCodeTranslatePipe', () => {
  let pipe: CountryCodeTranslatePipe;
  let translateService: TranslateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot()
      ],
      providers: [
        CountryCodeTranslatePipe,
        TranslateService
      ]
    });

    pipe = TestBed.inject(CountryCodeTranslatePipe);
    translateService = TestBed.inject(TranslateService);

    translateService.setTranslation('fr', {
      country_ch: 'Suisse'
    });
    translateService.use('fr');
  });

  it('should be created', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return the name of the country according to the language', () => {
    expect(pipe.transform('ch')).toEqual('Suisse');
  });
});
