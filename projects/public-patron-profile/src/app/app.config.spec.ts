// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { provideHttpClientTesting } from '@angular/common/http/testing';
import { LOCALE_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { CoreConfigService } from '@rero/ng-core';
import { of } from 'rxjs';

import { appConfig } from './app.config';
import { AppConfigService } from './app-config-service.service';
import { AppInitializerService } from './app-initializer.service';

describe('appConfig', () => {

  beforeEach(() => {
    // The app initializer sets the language before LOCALE_ID is resolved.
    vi.spyOn(TranslateService.prototype, 'getCurrentLang').mockReturnValue('fr');
    TestBed.configureTestingModule({
      providers: [
        ...appConfig.providers,
        provideHttpClientTesting(),
        { provide: AppInitializerService, useValue: { load: vi.fn().mockReturnValue(of(null)) } },
      ]
    });
  });

  afterEach(() => vi.restoreAllMocks());

  it('should share the AppConfigService instance as CoreConfigService', () => {
    expect(TestBed.inject(CoreConfigService)).toBe(TestBed.inject(AppConfigService));
  });

  it('should take the locale from the language in use', () => {
    expect(TestBed.inject(LOCALE_ID)).toBe('fr');
  });
});
