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
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { LocationApiService } from './location-api.service';


describe('LocationService', () => {
  let service: LocationApiService;

  const locations = {
    locations: [
      { pid: '1', pickup_name: 'location 1 pickup name', name: 'location 1 name' },
      { pid: '2',  name: 'location 2 name' }
    ]
  };

  const locationsResponse = [
    { pid: '1', name: 'location 1 pickup name' },
    { pid: '2', name: 'location 2 name' }
  ];

  const httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
  httpClientSpy.get.and.returnValue(of(locations));

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        { provide: HttpClient, useValue: httpClientSpy }
      ]
    });
    service = TestBed.inject(LocationApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should a set of pickup locations', () => {
    service.getPickupLocationsByRecordId('item', '1').subscribe(response => {
      expect(response).toEqual(locationsResponse);
    });
  });
});
