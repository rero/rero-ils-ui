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

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuComponent } from './menu.component';
import { CollapseModule, BsDatepickerModule, TypeaheadModule } from 'ngx-bootstrap';
import { RecordModule } from '@rero/ng-core';
import {TranslateModule} from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UserService } from '../service/user.service';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;
  const userService = jasmine.createSpyObj('UserService', ['getCurrentUser']);
  userService.getCurrentUser.and.returnValue({
    first_name: 'John',
    last_name: 'Doe',
    library: {
      pid: '1'
    }
  });

  beforeEach(async(() => {

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
      declarations: [ MenuComponent ],
      providers: [
        { provide: UserService, useValue: userService }
      ]
    })
    .compileComponents();

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
