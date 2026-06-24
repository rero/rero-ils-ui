// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { testUserPatronWithSettings } from '../../tests/user';
import { AppStore } from '../store/app.store';
import { ExtractSourceFieldPipe } from './extract-source-field.pipe';


describe('Pipe: ExtractFieldSource', () => {

  let extractSourceFieldPipe: ExtractSourceFieldPipe;
  const {settings} = testUserPatronWithSettings;

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
