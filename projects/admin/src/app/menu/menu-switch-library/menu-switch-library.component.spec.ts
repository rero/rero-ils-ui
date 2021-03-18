/*
 * RERO ILS UI
 * Copyright (C) 2020 RERO
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
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { CoreModule } from '@rero/ng-core';
import { LibrarySwitchMenuService } from '../service/library-switch-menu.service';
import { MenuSwitchLibraryComponent } from './menu-switch-library.component';


describe('MenuSwithLibraryComponent', () => {
  let component: MenuSwitchLibraryComponent;
  let fixture: ComponentFixture<MenuSwitchLibraryComponent>;

  const librarySwitchMenuServiceSpy = jasmine.createSpyObj('LibrarySwitchMenuService', ['']);
  librarySwitchMenuServiceSpy.menu = [];
  librarySwitchMenuServiceSpy.isVisible = false;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuSwitchLibraryComponent ],
      imports: [
        CoreModule,
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        RouterTestingModule
      ],
      providers: [
        { provide: LibrarySwitchMenuService, useValue: librarySwitchMenuServiceSpy }
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuSwitchLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
