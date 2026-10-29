// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { formatDate } from '@angular/common';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { createEnvironmentInjector, EnvironmentInjector } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ConfigOption, FORMLY_CONFIG } from '@ngx-formly/core';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { CoreConfigService } from '@rero/ng-core';
import { AppTranslateService } from '@rero/shared';
import { of } from 'rxjs';

import { AppConfigService } from './app-config-service.service';
import { AppInitializerService } from './app-initializer.service';
import { appConfig } from './app.config';

describe('appConfig', () => {
  it('should register the Formly types of the request form', () => {
    // The root-provided services of ng-core resolve TranslateService from the root injector.
    TestBed.configureTestingModule({ providers: [provideTranslateService()] });
    const injector = createEnvironmentInjector(appConfig.providers, TestBed.inject(EnvironmentInjector));
    // A FORMLY_CONFIG entry is a config or an array of configs.
    const configs = (injector.get(FORMLY_CONFIG, []) as (ConfigOption | ConfigOption[])[]).flat();
    const types = configs.flatMap((config) => (config.types ?? []).map((type) => type.name));

    expect(types).toContain('select');
    expect(types).toContain('textarea');
    injector.destroy();
  });

  describe('in the root injector', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          ...appConfig.providers,
          provideHttpClientTesting(),
          { provide: AppInitializerService, useValue: { load: vi.fn().mockReturnValue(of(null)) } },
        ],
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
});
