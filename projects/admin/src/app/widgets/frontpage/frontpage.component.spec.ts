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

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { UserService } from '@rero/shared';
import { BehaviorSubject, of, Subject } from 'rxjs';
import { AppModule } from '../../app.module';
import { AppInitializerService } from '../../service/app-initializer.service';
import { FrontpageComponent } from './frontpage.component';


describe('FrontpageComponent', () => {
  let component: FrontpageComponent;
  let fixture: ComponentFixture<FrontpageComponent>;

  const appInitializerService = jasmine.createSpyObj(
    'AppInitializerService', ['initTranslateService', 'load']
  );

  appInitializerService.initTranslateService.and.returnValue(null);
  const userService = jasmine.createSpyObj(
    'UserService', ['init', 'load']
  );
  userService.init.and.returnValue(null);
  userService.user =  {
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
  appInitializerService.load.and.returnValue(
    of(userService.user)
  );
  userService.loaded$ = new BehaviorSubject(userService.user);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        TranslateModule.forRoot({}),
        HttpClientTestingModule,
        AppModule
      ],
      providers: [
        { provide: AppInitializerService, useValue: appInitializerService },
        { provide: UserService, useValue: userService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrontpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
