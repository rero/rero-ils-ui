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
