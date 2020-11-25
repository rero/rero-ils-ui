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

import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { AppRoutingModule } from '../app-routing.module';
import { ErrorPageComponent } from '../error/error-page.component';
import { MainComponent } from '../main/main.component';
import { RouteFactoryService } from './route-factory.service';

describe('RouteFactoryService', () => {

  let service: RouteFactoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        MainComponent,
        ErrorPageComponent
      ],
      imports: [
        AppRoutingModule,
        TranslateModule.forRoot()
      ]
    });
    service = TestBed.inject(RouteFactoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
