/*
 * RERO ILS UI
 * Copyright (C) 2021-2023 RERO
 * Copyright (C) 2021-2023 UCLouvain
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
import { RecordService } from '@rero/ng-core';
import { of } from 'rxjs';
import { OrganisationApiService } from './organisation-api.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('OrganisationApiService', () => {
  let service: OrganisationApiService;

  const response = {
    metadata: {
      name: 'Organisation name'
    }
  }
  const recordServiceSpy = jasmine.createSpyObj('RecordService', ['getRecord']);
  recordServiceSpy.getRecord.and.returnValue(of(response));

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [TranslateModule.forRoot()],
    providers: [
        { provide: RecordService, useValue: recordServiceSpy },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
});
    service = TestBed.inject(OrganisationApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return the organization\'s data', () => {
    service.getByPid('1').subscribe((data: any) => {
      expect(data.name).toEqual(response.metadata.name);
    });

  });
});
