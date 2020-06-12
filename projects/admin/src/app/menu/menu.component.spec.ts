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
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RecordService } from '@rero/ng-core';
import { recordTestingService } from 'projects/admin/tests/utils';
import { of } from 'rxjs';
import { AppModule } from '../app.module';
import { LibrarySwitchService } from '../service/library-switch.service';
import { UserService } from '../service/user.service';
import { MenuComponent } from './menu.component';


describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;

  const libraryTestingSwitchService = jasmine.createSpyObj(
    'LibrarySwitchService', ['generateMenu']);
  libraryTestingSwitchService.entries = [{ entries: [] }];
  libraryTestingSwitchService.onGenerate$ = of([]);
  libraryTestingSwitchService.currentLibraryRecord$ = of({code: 1});

  const userTestingService = jasmine.createSpyObj(
    'UserService', ['getCurrentUser', 'hasRole']
  );
  userTestingService.getCurrentUser.and.returnValue({
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
  userTestingService.hasRole.and.returnValue(true);

  recordTestingService.getRecord.and.returnValue(of({
    metadata: {
      code: '1'
    }
  }));

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppModule,
        TranslateModule.forRoot(),
        RouterTestingModule
      ],
      providers: [
        { provide: RecordService, useValue: recordTestingService },
        { provide: UserService, useValue: userTestingService },
        { provide: LibrarySwitchService, useValue: libraryTestingSwitchService }
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
