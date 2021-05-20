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

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { testUserPatronMultipleOrganisationsWithSettings, UserApiService, UserService } from '@rero/shared';
import { of } from 'rxjs';
import { AcquisitionModule } from '../../../acquisition.module';
import { AcqAccountApiService } from '../../../api/acq-account-api.service';

import { AccountTransferComponent } from './account-transfer.component';

describe('AccountTransferComponent', () => {
  let component: AccountTransferComponent;
  let fixture: ComponentFixture<AccountTransferComponent>;

  const accountsApiServiceSpy = jasmine.createSpyObj('AcqAccountApiService', ['getAccounts']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountTransferComponent ],
      imports: [
        RouterTestingModule,
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        AcquisitionModule
      ],
      providers: [
        { provide: AcqAccountApiService, useValue: accountsApiServiceSpy }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    accountsApiServiceSpy.getAccounts.and.returnValue(of([]));
    fixture = TestBed.createComponent(AccountTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
