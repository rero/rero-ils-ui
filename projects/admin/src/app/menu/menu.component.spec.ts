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
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RecordModule, RecordService } from '@rero/ng-core';
import { BsDatepickerModule, CollapseModule, TypeaheadModule } from 'ngx-bootstrap';
import { of } from 'rxjs';
import { InterfaceInfoComponent } from '../interface-info/interface-info.component';
import { UserService } from '../service/user.service';
import { MenuComponent } from './menu.component';


describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;
  let recordServiceSpy: jasmine.SpyObj<RecordService>;

  const userService = jasmine.createSpyObj(
    'UserService', ['getCurrentUser', 'hasRole']
  );
  userService.getCurrentUser.and.returnValue({
    first_name: 'John',
    last_name: 'Doe',
    library: {
      pid: '1',
      organisation: {
        pid: '1'
      },
      current: '1'
    }
  });
  userService.hasRole.and.returnValue(true);

  beforeEach(async(() => {
    const spy = jasmine.createSpyObj('RecordService', ['getRecord']);

    TestBed.configureTestingModule({
      imports: [
        CollapseModule,
        RecordModule,
        TranslateModule.forRoot(),
        BsDatepickerModule.forRoot(),
        HttpClientModule,
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        TypeaheadModule.forRoot(),
        RouterTestingModule
      ],
      declarations: [ MenuComponent, InterfaceInfoComponent ],
      providers: [
        { provide: RecordService, useValue: spy },
        { provide: UserService, useValue: userService }
      ]
    })
    .compileComponents();

    recordServiceSpy = TestBed.get(RecordService);
    recordServiceSpy.getRecord.and.returnValue(of({
      metadata: {
        code: '1'
      }
    }));

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // TODO: enable tests
  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });

  afterEach(() => {
    TestBed.resetTestingModule();
  });
});
