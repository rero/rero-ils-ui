// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { formatDate } from '@angular/common';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { CoreConfigService } from '@rero/ng-core';
import { AppTranslateService } from '@rero/shared';
import { of } from 'rxjs';

import { appConfig } from './app.config';
import { AppConfigService } from './app-config-service.service';
import { AppInitializerService } from './app-initializer.service';

describe('appConfig', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ...appConfig.providers,
        provideHttpClientTesting(),
        { provide: AppInitializerService, useValue: { load: vi.fn().mockReturnValue(of(null)) } },
      ]
    });
  });

  it('should resolve TranslateService to the application translate service', () => {
    expect(TestBed.inject(TranslateService)).toBe(TestBed.inject(AppTranslateService));
  });

  it('should share the AppConfigService instance as CoreConfigService', () => {
    expect(TestBed.inject(CoreConfigService)).toBe(TestBed.inject(AppConfigService));
  });

  it('should register the locale data of the language in use', () => {
    TestBed.inject(TranslateService).use('fr');
    expect(formatDate('2026-11-16T22:58:59.963520+00:00', 'shortDate', 'fr', 'UTC')).toBe('16/11/2026');
  });
});
