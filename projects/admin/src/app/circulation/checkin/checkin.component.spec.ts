/*
 * RERO ILS UI
 * Copyright (C) 2019 RERO
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

import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { CoreModule, RecordModule } from '@rero/ng-core';
import { CollapseModule } from 'ngx-bootstrap';
import { UserService } from '../../service/user.service';
import { ItemComponent } from '../item/item.component';
import { ItemsListComponent } from '../items-list/items-list.component';
import { CardComponent } from '../patron/card/card.component';
import { CheckinComponent } from './checkin.component';


describe('CheckoutComponent', () => {
  let component: CheckinComponent;
  let fixture: ComponentFixture<CheckinComponent>;

  const userService = jasmine.createSpyObj(
    'UserService', ['getCurrentUser']
  );
  userService.getCurrentUser.and.returnValue({
    first_name: 'John',
    last_name: 'Doe',
    library: {
      pid: '1',
      organisation: {
        pid: '1'
      },
      current: '1',
    },
    getCurrentLibrary: () => '1'
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        CoreModule,
        RecordModule,
        HttpClientModule,
        RouterTestingModule,
        CollapseModule,
        BrowserAnimationsModule
      ],
      declarations: [
        CardComponent,
        CheckinComponent,
        ItemsListComponent,
        ItemComponent
      ],
      providers: [
        { provide: UserService, useValue: userService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
