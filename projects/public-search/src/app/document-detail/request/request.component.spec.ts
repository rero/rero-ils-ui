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
import { TranslateModule } from '@ngx-translate/core';
import { testUserPatronWithSettings, UserApiService, UserService } from '@rero/shared';
import { cloneDeep } from 'lodash-es';
import { of } from 'rxjs';
import { ItemApiService } from '../../api/item-api.service';
import { HoldingsApiService } from '../../api/holdings-api.service';
import { RequestComponent } from './request.component';

describe('RequestComponentItem', () => {
  let component: RequestComponent;
  let fixture: ComponentFixture<RequestComponent>;
  let userService: UserService;

  const itemRecord = {
    metadata: {
      pid: '10',
      organisation: {
        pid: '2'
      },
      library: {
        pid: '1'
      }
    }
  };

  const userApiServiceSpy = jasmine.createSpyObj('UserApiService', ['getLoggedUser']);

  const itemApiServiceSpy = jasmine.createSpyObj('ItemApiService', ['canRequest']);
  itemApiServiceSpy.canRequest.and.returnValue(of({ can: true }));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot()
      ],
      declarations: [ RequestComponent ],
      providers: [
        { provide: UserApiService, useValue: userApiServiceSpy },
        { provide: ItemApiService, useValue: itemApiServiceSpy }
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestComponent);
    component = fixture.componentInstance;
    component.record = itemRecord;
    component.recordType = 'item';
    userApiServiceSpy.getLoggedUser.and.returnValue(of(cloneDeep(testUserPatronWithSettings)));
    userService = TestBed.inject(UserService);
    userService.load().subscribe();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the request button', () => {
    const id = `#record-${itemRecord.metadata.pid}-request-button`;
    const showMore = fixture.nativeElement.querySelector(id);
    expect(showMore.textContent).toContain('Request');
  });
});

describe('RequestComponentHolding', () => {
  let component: RequestComponent;
  let fixture: ComponentFixture<RequestComponent>;
  let userService: UserService;

  const holdingRecord = {
    metadata: {
      pid: '665',
      organisation: {
        pid: '2'
      },
      library: {
        pid: '1'
      }
    }
  };

  const userApiServiceSpy = jasmine.createSpyObj('UserApiService', ['getLoggedUser']);

  const holdingApiServiceSpy = jasmine.createSpyObj('HoldingsApiService', ['canRequest']);
  holdingApiServiceSpy.canRequest.and.returnValue(of({ can: true }));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot()
      ],
      declarations: [ RequestComponent ],
      providers: [
        { provide: UserApiService, useValue: userApiServiceSpy },
        { provide: HoldingsApiService, useValue: holdingApiServiceSpy }
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestComponent);
    component = fixture.componentInstance;
    component.record = holdingRecord;
    component.recordType = 'holding';
    userApiServiceSpy.getLoggedUser.and.returnValue(of(cloneDeep(testUserPatronWithSettings)));
    userService = TestBed.inject(UserService);
    userService.load();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the request button', () => {
    const id = `#record-${holdingRecord.metadata.pid}-request-button`;
    const showMore = fixture.nativeElement.querySelector(id);
    expect(showMore.textContent).toContain('Request');
  });
});
