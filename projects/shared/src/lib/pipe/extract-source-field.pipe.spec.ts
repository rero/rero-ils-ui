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
import { SharedConfigService } from '../service/shared-config.service';
import { ExtractSourceFieldPipe } from './extract-source-field.pipe';


describe('Pipe: ExtractFieldSource', () => {

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

  const sharedConfigServiceSpy = jasmine.createSpyObj('SharedConfigService', ['']);
  sharedConfigServiceSpy.contributionsLabelOrder = {
    de: ['gnd', 'idref', 'rero'],
    fr: ['idref', 'gnd', 'rero'],
    fallback: 'fr'
  };

  const translateServiceSpy = jasmine.createSpyObj('TranslateService', ['']);
  translateServiceSpy.currentLang = 'en';

  let extractSourceFieldPipe: ExtractSourceFieldPipe;

  let translateService: TranslateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot()
      ],
      providers: [
        ExtractSourceFieldPipe,
        { provide: SharedConfigService, useValue: sharedConfigServiceSpy },
        { provide: TranslateService, useValue: translateServiceSpy }
      ]
    });

    extractSourceFieldPipe = TestBed.inject(ExtractSourceFieldPipe);
    translateService = TestBed.inject(TranslateService);
  });

  it('create an instance', () => {
    expect(extractSourceFieldPipe).toBeTruthy();
  });

  it('transform data with french language', () => {
    translateService.currentLang = 'fr';
    expect(
      extractSourceFieldPipe.transform(metadata, field)
    ).toEqual('idref-access-point');
  });

  it('transform data with deutsch language', () => {
    translateService.currentLang = 'de';
    expect(
      extractSourceFieldPipe.transform(metadata, field)
    ).toEqual('gnd-access-point');
  });

  it('transform data with it language (fallback)', () => {
    translateService.currentLang = 'it';
    expect(
      extractSourceFieldPipe.transform(metadata, field)
    ).toEqual('idref-access-point');
  });
});
