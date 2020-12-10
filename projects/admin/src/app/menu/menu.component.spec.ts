import { HttpClientTestingModule } from '@angular/common/http/testing';
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
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RecordService } from '@rero/ng-core';
import { User, UserService } from '@rero/shared';
import { recordTestingService } from 'projects/admin/tests/utils';
import { of } from 'rxjs';
import { AppModule } from '../app.module';
import { LibrarySwitchMenuService } from './menu-switch-library/service/library-switch-menu.service';
import { MenuComponent } from './menu.component';


describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;

  const librarySwitchMenuServiceSpy = jasmine.createSpyObj('LibrarySwitchMenuService', ['init']);
  librarySwitchMenuServiceSpy._user = new User({
    roles: ['system_librarian']
  });
  librarySwitchMenuServiceSpy.init.and.returnValue(null);
  const userTestingService = jasmine.createSpyObj(
    'UserService', ['init']
  );
  userTestingService.init.and.returnValue(null);

  userTestingService.user = {
    first_name: 'John',
    last_name: 'Doe',
    library: {
      pid: '1',
      organisation: {
        pid: '1'
      },
      current: '1'
    }
  };

  recordTestingService.getRecord.and.returnValue(of({
    metadata: {
      code: '1'
    }
  }));

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        AppModule,
        TranslateModule.forRoot(),
        RouterTestingModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: RecordService, useValue: recordTestingService },
        { provide: UserService, useValue: userTestingService },
        { provide: LibrarySwitchMenuService, useValue: librarySwitchMenuServiceSpy },
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
