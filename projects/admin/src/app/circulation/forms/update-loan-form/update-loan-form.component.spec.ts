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
import { LOCALE_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule, User } from '@rero/shared';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Loan } from '../../../class/items';
import { CirculationModule } from '../../circulation.module';

import { UpdateLoanFormComponent } from './update-loan-form.component';

describe('UpdateLoanFormComponent', () => {

  const loan = new Loan({
    $schema: 'https://ils.rero.ch/schemas/loans/loan-ils-v0.0.1.json',
    document_pid: '214',
    end_date: '2020-11-18T16:18:21.920676+00:00',
    item_pid: {
      type: 'item',
      value: '928'
    },
    organisation: {
      $ref: 'https://ils.rero.ch/api/organisations/1'
    },
    patron_pid: '8',
    pickup_location_pid: '1',
    pid: '14',
    start_date: '2021-01-27T16:18:20.836813+00:00',
    state: 'ITEM_ON_LOAN',
    to_anonymize: false,
    transaction_date: '2021-01-27T16:18:20.836813+00:00',
    transaction_location_pid: '13',
    transaction_user_pid: '6',
    trigger: 'checkout'
  });

  let component: UpdateLoanFormComponent;
  let fixture: ComponentFixture<UpdateLoanFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateLoanFormComponent ],
      imports: [
        CirculationModule,
        SharedModule,
        TranslateModule.forRoot(),
        HttpClientTestingModule
      ],
      providers: [
        BsModalRef,
        { provide: LOCALE_ID, useValue: 'en-US' }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateLoanFormComponent);
    component = fixture.componentInstance;
    component.loan = loan;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
