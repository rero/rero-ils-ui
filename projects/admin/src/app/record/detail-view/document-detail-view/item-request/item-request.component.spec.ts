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
import { LOCALE_ID } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { of } from 'rxjs';
import { AppModule } from '../../../../app.module';
import { LoanService } from '../../../../service/loan.service';
import { ItemRequestComponent } from './item-request.component';


describe('ItemRequestComponent', () => {
  let component: ItemRequestComponent;
  let fixture: ComponentFixture<ItemRequestComponent>;
  const loanTestingService = jasmine.createSpyObj(
    'LoanService', ['requestedBy$']
  );
  loanTestingService.requestedBy$.and.returnValue(of({}));

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        AppModule
      ],
      providers: [
        BsModalRef,
        {provide: LOCALE_ID, useValue: 'en-US' },
        {provide: LoanService,  useValue: loanTestingService}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
