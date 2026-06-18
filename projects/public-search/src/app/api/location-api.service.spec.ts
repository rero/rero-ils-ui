// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { HttpClient } from '@angular/common/http';
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

  const httpClientSpy = { get: vi.fn() };
  httpClientSpy.get.mockReturnValue(of(locations));

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
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
