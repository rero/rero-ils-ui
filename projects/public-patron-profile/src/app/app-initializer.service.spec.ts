// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

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
