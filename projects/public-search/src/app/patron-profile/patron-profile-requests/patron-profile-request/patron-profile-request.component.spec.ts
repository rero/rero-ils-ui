/*
 * RERO ILS UI
 * Copyright (C) 2021-2025 RERO
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
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule, testUserPatronWithSettings, UserApiService, UserService } from '@rero/shared';
import { cloneDeep } from 'lodash-es';
import { of } from 'rxjs';
import { PatronProfileMenuStore } from '../../store/patron-profile-menu-store';
import { RequestsStore } from '../../store/requests-store';
import { PatronProfileRequestComponent } from './patron-profile-request.component';

describe('PatronProfileRequestComponent', () => {
  let component: PatronProfileRequestComponent;
  let fixture: ComponentFixture<PatronProfileRequestComponent>;
  let userService: UserService;
  let patronProfileMenuStore: InstanceType<typeof PatronProfileMenuStore>;

  const record = {
    metadata: {
      pid: '1',
      document: {
        pid: '1',
        title: [{ type: 'bf:Title', _text: 'Document title' }]
      },
      item: {
        location: { pid: 'loc1' }
      },
      pickup_name: 'Pickup name',
      state: 'ITEM_AT_DESK',
      rank: 3
    }
  };

  const userApiServiceSpy = jasmine.createSpyObj('UserApiService', ['getLoggedUser']);
  const requestsStoreMock = {
    cancelInProgress: signal(false),
    cancelRequest: jasmine.createSpy('cancelRequest')
  };

  const patronProfileMenuStoreMock = {
    currentPatron: signal({ pid: 'patron1', organisation: { code: 'RERO' } })
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PatronProfileRequestComponent],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        TranslateModule.forRoot(),
        SharedModule
      ],
      providers: [
        { provide: UserApiService, useValue: userApiServiceSpy },
        { provide: RequestsStore, useValue: requestsStoreMock },
        { provide: PatronProfileMenuStore, useValue: patronProfileMenuStoreMock },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatronProfileRequestComponent);
    component = fixture.componentInstance;
    userApiServiceSpy.getLoggedUser.and.returnValue(of(cloneDeep(testUserPatronWithSettings)));
    userService = TestBed.inject(UserService);
    userService.load().subscribe();
    patronProfileMenuStore = TestBed.inject(PatronProfileMenuStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the document information button and link', () => {
    component.record = record;
    fixture.detectChanges();
    const documentLink = fixture.nativeElement.querySelector('public-search-patron-profile-document');
    expect(documentLink.length === 1);

    const pickupName = fixture.nativeElement.querySelectorAll('div')[1];
    expect(pickupName.textContent).toContain('Pickup name');
  });

  it('should display the loan with ITEM_AT_DESK state', () => {
    record.metadata.state = 'ITEM_AT_DESK';
    component.record = record;
    fixture.detectChanges();
    const div = fixture.nativeElement.querySelectorAll('div')[2];
    expect(div.textContent).toContain('to pick up');
  });

  it('should display the loan with PENDING state', () => {
    record.metadata.state = 'PENDING';
    component.record = record;
    fixture.detectChanges();
    const div = fixture.nativeElement.querySelectorAll('div')[2];
    expect(div.textContent).toContain('(position {{ rank }} in waiting list)');
    const button = fixture.nativeElement.querySelector('.p-button-label');
    expect(button.textContent).toContain('Cancel');
  });

  it('should call cancelRequest on cancel button click', () => {
    record.metadata.state = 'PENDING';
    component.record = record;
    fixture.detectChanges();

    component.cancel();
    expect(requestsStoreMock.cancelRequest).toHaveBeenCalled();
  });
});
