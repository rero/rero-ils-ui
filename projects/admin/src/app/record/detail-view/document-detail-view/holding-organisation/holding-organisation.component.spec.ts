/*
 * RERO ILS UI
 * Copyright (C) 2021 RERO
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
import { TranslateModule } from '@ngx-translate/core';
import { UserService } from '@rero/shared';
import { HoldingsApiService } from '@app/admin/api/holdings-api.service';
import { of } from 'rxjs';
import { HoldingOrganisationComponent } from './holding-organisation.component';


describe('HoldingOrganisationComponent', () => {
  let component: HoldingOrganisationComponent;
  let fixture: ComponentFixture<HoldingOrganisationComponent>;

  const data = {
    metadata: {
      pid: '1',
      issuance: {
        main_type: 'book'
      }
    }
  };

  const holdingApiServiceSpy = jasmine.createSpyObj('HoldingsApiService', ['getHoldingsCount']);
  holdingApiServiceSpy.getHoldingsCount.and.returnValue(of(1));

  const userServiceSpy = jasmine.createSpyObj('UserService', ['']);
  userServiceSpy.user = { currentOrganisation: 1 };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HoldingOrganisationComponent ],
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: HoldingsApiService, useValue: holdingApiServiceSpy },
        { provide: UserService, useValue: userServiceSpy }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HoldingOrganisationComponent);
    component = fixture.componentInstance;
    component.document = data;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
