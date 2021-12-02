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
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { FormlyModule } from '@ngx-formly/core';
import { TranslateModule } from '@ngx-translate/core';
import { CoreModule } from '@rero/ng-core';
import { UserService } from '@rero/shared';
import { of } from 'rxjs';
import { ItemApiService } from '../../../api/item-api.service';
import { LocationApiService } from '../../../api/location-api.service';
import { PickupLocationComponent } from './pickup-location.component';


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

  const locationServiceSpy = jasmine.createSpyObj('LocationService', ['getPickupLocationsByRecordId']);
  locationServiceSpy.getPickupLocationsByRecordId.and.returnValue(of(pickupLocations));

  const userServiceSpy = jasmine.createSpyObj('UserService', ['']);

  const itemServiceSpy = jasmine.createSpyObj('ItemService', ['']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        CoreModule,
        FormsModule,
        ReactiveFormsModule,
        FormlyModule.forRoot(),
        FormlyBootstrapModule
      ],
      declarations: [ PickupLocationComponent ],
      providers: [
        { provide: LocationApiService, useValue: locationServiceSpy },
        { provide: UserService, useValue: userServiceSpy },
        { provide: ItemApiService, useValue: itemServiceSpy }
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PickupLocationComponent);
    component = fixture.componentInstance;
    component.record = itemRecord;
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
