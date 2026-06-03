/*
 * RERO ILS UI
 * Copyright (C) 2020 RERO
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
import { testUserPatronWithSettings } from '../../tests/user';
import { AppStore } from '../store/app.store';
import { ExtractSourceFieldPipe } from './extract-source-field.pipe';


describe('Pipe: ExtractFieldSource', () => {

  let extractSourceFieldPipe: ExtractSourceFieldPipe;
  let settings = testUserPatronWithSettings.settings;

  const metadata = {
    idref: {
      authorized_access_point: 'idref-access-point'
    },
    gnd: {
      authorized_access_point: 'gnd-access-point'
    },
    rero: {
      authorized_access_point: 'rero-access-point'
    }
  };

  const field = 'authorized_access_point';

  let currentLang = 'en';
  const translateServiceSpy = { getCurrentLang: () => currentLang };

  beforeEach(() => {
    currentLang = 'en';
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot()
      ],
      providers: [
        ExtractSourceFieldPipe,
        { provide: AppStore, useValue: { settings: vi.fn(() => settings) } },
        { provide: TranslateService, useValue: translateServiceSpy }
      ]
    });

    extractSourceFieldPipe = TestBed.inject(ExtractSourceFieldPipe);
    settings = testUserPatronWithSettings.settings;
  });

  it('create an instance', () => {
    expect(extractSourceFieldPipe).toBeTruthy();
  });

  it('transform data with french language', () => {
    currentLang = 'fr';
    expect(
      extractSourceFieldPipe.transform(metadata, field)
    ).toEqual('idref-access-point');
  });

  it('transform data with deutsch language', () => {
    currentLang = 'de';
    expect(
      extractSourceFieldPipe.transform(metadata, field)
    ).toEqual('gnd-access-point');
  });

  it('transform data with it language (fallback)', () => {
    currentLang = 'it';
    expect(
      extractSourceFieldPipe.transform(metadata, field)
    ).toEqual('idref-access-point');
  });
});
