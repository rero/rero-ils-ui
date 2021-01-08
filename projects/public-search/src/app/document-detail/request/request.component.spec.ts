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
import { of } from 'rxjs';
import { ItemService } from '../../api/item.service';
import { UserService } from '../../user.service';
import { RequestComponent } from './request.component';


describe('RequestComponent', () => {
  let component: RequestComponent;
  let fixture: ComponentFixture<RequestComponent>;

  const userRecord = {
    patron: {
      barcode: 'B123456'
    }
  };

  const itemRecord = {
    metadata: {
      pid: '1'
    }
  };

  const userServiceSpy = jasmine.createSpyObj('UserService', ['']);
  userServiceSpy.user = userRecord;

  const itemServiceSpy = jasmine.createSpyObj('ItemService', ['canRequest']);
  itemServiceSpy.canRequest.and.returnValue(of({ can: true }));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot()
      ],
      declarations: [ RequestComponent ],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        { provide: ItemService, useValue: itemServiceSpy }
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
    component.item = itemRecord;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the request button', () => {
    const showMore = fixture.nativeElement.querySelector('#item-request-1');
    expect(showMore.textContent).toBeTruthy('Request');
  });
});
