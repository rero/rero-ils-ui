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
import { DocumentsRouteService } from './documents-route.service';

describe('DocumentRouteService', () => {
  let service: DocumentsRouteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot()
      ]
    });
    service = TestBed.inject(DocumentsRouteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve the name', () => {
    expect(service.getResources()).toEqual(['documents', 'persons', 'corporate-bodies']);
  });

  it('should create the configuration the first time, then the return is undefined', () => {
    let config = service.create('aoste');
    expect(typeof config === 'object').toBeTruthy();
    config = service.create('aoste');
    expect(config).toEqual(undefined);
  });
});
