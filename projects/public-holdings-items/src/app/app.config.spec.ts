// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { createEnvironmentInjector, EnvironmentInjector } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ConfigOption, FORMLY_CONFIG } from '@ngx-formly/core';
import { provideTranslateService } from '@ngx-translate/core';

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
});
