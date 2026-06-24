// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { NgCoreTranslateService } from '@rero/ng-core';
import { AppStore, AppTranslateLanguageService, testUserPatronWithSettings, User } from '@rero/shared';
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
      { provide: AppTranslateLanguageService, useValue: { loadLanguageNow: vi.fn().mockResolvedValue(undefined) } },
      { provide: AppConfigService, useValue: { languages: ['en', 'fr', 'de', 'it'], defaultLanguage: 'en' } }
    ]
  }));

  it('should be created', () => {
    const service: AppInitializerService = TestBed.inject(AppInitializerService);
    expect(service).toBeTruthy();
  });
});
