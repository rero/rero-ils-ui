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
import { async, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RecordModule } from '@rero/ng-core';
import { BsDatepickerModule, BsDropdownModule, CollapseModule, TypeaheadModule } from 'ngx-bootstrap';
import { AppComponent } from './app.component';
import { InterfaceInfoComponent } from './interface-info/interface-info.component';
import { MenuComponent } from './menu/menu.component';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        CollapseModule,
        FormsModule,
        RecordModule,
        HttpClientModule,
        BsDatepickerModule.forRoot(),
        BsDropdownModule.forRoot(),
        TranslateModule.forRoot({}),
        TypeaheadModule.forRoot()
      ],
      declarations: [
        AppComponent,
        MenuComponent,
        InterfaceInfoComponent
      ]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });
});
