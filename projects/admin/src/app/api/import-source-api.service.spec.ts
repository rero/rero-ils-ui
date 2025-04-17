/*
 * RERO ILS UI
 * Copyright (C) 2025 RERO
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

import { TestBed } from "@angular/core/testing";
import { ImportSourceApiService } from "./import-source-api.service";
import { HttpClient } from "@angular/common/http";
import { of } from "rxjs";
import { ExternalSourceSetting } from "../classes/external-source";

describe('ImportSourceApiService', () => {
  let service: ImportSourceApiService;

  const data = {
    key: 'import-a',
    label: 'Import A',
    weight: 100,
    endpoint: '/source/api/import'
  };

  const httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
  httpClientSpy.get.and.returnValue(of([data]));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ImportSourceApiService,
        { provide: HttpClient, useValue: httpClientSpy }
      ]
    });

    service = TestBed.inject(ImportSourceApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a list of import sources', () => {
    service.getSources().subscribe((result: ExternalSourceSetting[]) => {
      expect(result).toHaveSize(1);
      expect(result[0]).toBeInstanceOf(ExternalSourceSetting);
    });
  });
});
