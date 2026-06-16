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

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { NgCoreTranslateService } from '@rero/ng-core';
import { AppStore, testUserPatronWithSettings, User } from '@rero/shared';
import { of } from 'rxjs';
import { AppConfigService } from './app-config.service';
import { AppInitializerService } from './app-initializer.service';

describe('AppInitializerService', () => {
  const appStoreSpy = {
    load: vi.fn().mockReturnValue(of(new User(testUserPatronWithSettings))),
    settings: vi.fn().mockReturnValue({ language: 'en' })
  };

  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      provideHttpClient(),
      provideHttpClientTesting(),
      { provide: AppStore, useValue: appStoreSpy },
      { provide: NgCoreTranslateService, useValue: { getBrowserLang: vi.fn().mockReturnValue('en'), initialize: vi.fn(), use: vi.fn().mockReturnValue(of(null)) } },
      { provide: AppConfigService, useValue: { languages: ['en', 'fr', 'de', 'it'], defaultLanguage: 'en' } }
    ]
  }));

  it('should be created', () => {
    const service: AppInitializerService = TestBed.inject(AppInitializerService);
    expect(service).toBeTruthy();
  });
});
