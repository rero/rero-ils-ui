/*
 * RERO ILS UI
 * Copyright (C) 2019-2025 RERO
 * Copyright (C) 2019-2023 UCLouvain
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
import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { IAvailability } from '@rero/shared';
import { of } from 'rxjs';
import { DocumentApiService } from './document-api.service';

describe('DocumentApiService', () => {
  let service: DocumentApiService;

  const httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);

  const availability: IAvailability = {
    available: true
  }

  const availabilityView: IAvailability = {
    available: false
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
    providers: [
      { provide: HttpClient, useValue: httpClientSpy }
    ]
});
    service = TestBed.inject(DocumentApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return the availability of the document', () => {
    httpClientSpy.get.and.returnValue(of(availability));
    service.getAvailability('1')
      .subscribe((response: IAvailability) => expect(response).toEqual(availability));
  });

  it('should return the availability of the document from current view', () => {
    httpClientSpy.get.and.returnValue(of(availabilityView));
    service.getAvailability('1', 'aoste')
      .subscribe((response: IAvailability) => expect(response).toEqual(availabilityView));
  });
});
