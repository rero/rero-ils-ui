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

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '@rero/shared';
import { AppInitializerService } from './app-initializer.service';


describe('AppInitializerService', () => {

  let appInitializerService: AppInitializerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        SharedModule
      ]
    });
    appInitializerService = TestBed.inject(AppInitializerService);
  });

  it('should be created', () => {
    expect(appInitializerService).toBeTruthy();
  });
});
