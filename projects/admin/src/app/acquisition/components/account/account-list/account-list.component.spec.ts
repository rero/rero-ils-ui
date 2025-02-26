/*
 * RERO ILS UI
 * Copyright (C) 2021 RERO
 * Copyright (C) 2021 UCLouvain
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

import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { UserService } from '@rero/shared';
import { of } from 'rxjs';
import { AcquisitionModule } from '../../../acquisition.module';
import { AcqAccountApiService } from '../../../api/acq-account-api.service';
import { AccountListComponent } from './account-list.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';


describe('AccountListComponent', () => {
  let component: AccountListComponent;
  let fixture: ComponentFixture<AccountListComponent>;

  const accountsServiceSpy = jasmine.createSpyObj('AcqAccountApiService', ['getAccounts']);

  const userServiceSpy = jasmine.createSpyObj('UserService', ['']);
  userServiceSpy.user = { currentLibrary: 1 };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [AccountListComponent],
    imports: [RouterTestingModule,
        TranslateModule.forRoot(),
        AcquisitionModule],
    providers: [
        { provide: AcqAccountApiService, useValue: accountsServiceSpy },
        { provide: UserService, useValue: userServiceSpy },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
})
    .compileComponents();
  });

  beforeEach(() => {
    accountsServiceSpy.getAccounts.and.returnValue(of([]));
    fixture = TestBed.createComponent(AccountListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
