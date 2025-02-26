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

import { provideHttpClientTesting } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule, UserService } from '@rero/shared';
import { AppInitializerService } from './app-initializer.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('Service: AppInit', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [TranslateModule.forRoot(),
        SharedModule],
    providers: [
        AppInitializerService,
        UserService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
});
  });

  it('should initialize app', inject([AppInitializerService], (service: AppInitializerService) => {
    expect(service).toBeTruthy();
  }));
});
