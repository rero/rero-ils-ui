/*
 * RERO ILS UI
 * Copyright (C) 2021-2024 RERO
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
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyPrimeNGModule } from '@ngx-formly/primeng';
import { TranslateModule } from '@ngx-translate/core';

import { of } from 'rxjs';
import { HoldingsApiService } from '../../../api/holdings-api.service';
import { ItemApiService } from '../../../api/item-api.service';
import { LocationApiService } from '../../../api/location-api.service';
import { PickupLocationComponent } from './pickup-location.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';


describe('PickupLocationComponent', () => {
  let component: PickupLocationComponent;
  let fixture: ComponentFixture<PickupLocationComponent>;

  const itemRecord = {
    metadata: {
      pid: '1'
    }
  };

  const pickupLocations = [
    { pid: '1', name: 'location 1' },
    { pid: '2', name: 'location 2' }
  ];

  const locationServiceSpy = { getPickupLocationsByRecordId: vi.fn() };
  locationServiceSpy.getPickupLocationsByRecordId.mockReturnValue(of(pickupLocations));

  const itemServiceSpy = {};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ],
    imports: [BrowserModule,
        TranslateModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        FormlyModule.forRoot(),
        FormlyPrimeNGModule],
    providers: [
        { provide: LocationApiService, useValue: locationServiceSpy },
        { provide: ItemApiService, useValue: itemServiceSpy },
        { provide: HoldingsApiService, useValue: {} },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PickupLocationComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('record', itemRecord);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the request button', () => {
    const pickup = fixture.nativeElement.querySelector('#pickup-location-1-confirm-button');
    expect(pickup.textContent).toBeTruthy();
  });
});
