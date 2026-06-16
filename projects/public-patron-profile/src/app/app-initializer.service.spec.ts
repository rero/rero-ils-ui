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

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NgCoreTranslateService } from '@rero/ng-core';
import { AppStore } from '@rero/shared';

import { AppConfigService } from '@app/admin/service/app-config.service';
import { of } from 'rxjs';
import { AppInitializerService } from './app-initializer.service';
import { PatronProfileStore } from '@app/public-search/patron-profile/store/patron-profile.store';


describe('AppInitializerService', () => {

  let appInitializerService: AppInitializerService;

  const ngCoreTranslateServiceSpy = {
    initialize: vi.fn(),
    use: vi.fn().mockReturnValue(of({})),
    getBrowserLang: vi.fn().mockReturnValue('en')
  };

  const appConfigServiceSpy = {
    languages: ['en', 'fr', 'de', 'it', 'ar', 'nl'],
    defaultLanguage: 'en'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AppStore, useValue: { load: vi.fn().mockReturnValue(of(null)), settings: vi.fn().mockReturnValue({ language: 'en' }), user: vi.fn().mockReturnValue(null) } },
        { provide: PatronProfileStore, useValue: { init: vi.fn() } },
        { provide: NgCoreTranslateService, useValue: ngCoreTranslateServiceSpy },
        { provide: AppConfigService, useValue: appConfigServiceSpy }
      ]
    });
    appInitializerService = TestBed.inject(AppInitializerService);
  });

  it('should be created', () => {
    expect(appInitializerService).toBeTruthy();
  });
});
