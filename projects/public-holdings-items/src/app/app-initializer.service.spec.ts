// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { AppStore } from '@rero/shared';
import { of } from 'rxjs';

import { AppInitializerService } from './app-initializer.service';


describe('AppInitializerService', () => {

  let appInitializerService: AppInitializerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AppStore, useValue: { load: vi.fn().mockReturnValue(of(null)), settings: vi.fn().mockReturnValue({ language: 'en' }) } }
      ]
    });
    appInitializerService = TestBed.inject(AppInitializerService);
  });

  it('should be created', () => {
    expect(appInitializerService).toBeTruthy();
  });
});
