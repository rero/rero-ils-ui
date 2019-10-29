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

import { MainRequestComponent } from './main-request.component';
import { RecordModule } from '@rero/ng-core';
import { RequestedItemsListComponent } from '../requested-items-list/requested-items-list.component';
import { RouterTestingModule } from '@angular/router/testing';
import { DataTablesModule } from 'angular-datatables';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';

describe('MainRequestComponent', () => {
  let component: MainRequestComponent;
  let fixture: ComponentFixture<MainRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RecordModule, DataTablesModule, RouterTestingModule, HttpClientModule, TranslateModule.forRoot()],
      declarations: [ MainRequestComponent, RequestedItemsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
