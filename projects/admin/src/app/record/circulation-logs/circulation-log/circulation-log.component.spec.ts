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
import { DateTranslatePipe, RecordModule } from '@rero/ng-core';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { BsModalService } from 'ngx-bootstrap/modal';
import { CirculationLogComponent } from './circulation-log.component';


describe('CirculationLogComponent', () => {
  let component: CirculationLogComponent;
  let fixture: ComponentFixture<CirculationLogComponent>;

  const record = {
    created: '2021-06-30T06:55:28.261181+00:00',
    id: '273a0b3e-d970-11eb-b8f9-8c859092e74d',
    links: {
      self: 'https://localhost:5000/api/operation_logs/273a0b3e-d970-11eb-b8f9-8c859092e74d'
    },
    metadata: {
      date: '2021-06-30T06:55:28.048793+00:00',
      loan: {
        item: {
          call_number: '00177',
          category: 'standard',
          document: {
            title: 'Poema de Mio Cid',
            type: 'docsubtype_other_book'
          },
          holding: {
            location_name: 'Section enfants',
            pid: '172'
          }
        },
        override_flag: false,
        patron: {
          age: 59,
          gender: 'other',
          name: 'Broglio, Giulia',
          postal_code: '6500',
          type: 'Standard'
        },
        pickup_location_name: 'Espaces publics',
        transaction_channel: 'system',
        transaction_location_name: 'Espaces publics',
        transaction_user_name: 'Rodriguez, Elena'
      },
      operation: 'create',
      pid: '273a0b3e-d970-11eb-b8f9-8c859092e74d',
      record: {
        $schema: 'https://bib.rero.ch/schemas/loans/loan-ils-v0.0.1.json',
        document_pid: '276',
        end_date: '2021-07-14T22:00:28.047793+00:00',
        item_pid: {
          type: 'item', value: '177'
        },
        organisation: {
          $ref: 'https://bib.rero.ch/api/organisations/1'
        },
        patron_pid: '10',
        pickup_location_pid: '11',
        pid: '31',
        start_date: '2021-06-30T06:55:28.048793+00:00',
        state: 'ITEM_ON_LOAN',
        to_anonymize: false,
        transaction_date: '2021-06-30T06:55:28.048793+00:00',
        transaction_location_pid: '11',
        transaction_user_pid: '3',
        trigger: 'checkout'
      },
      user_name: 'system'
    },
    updated: '2021-06-30T06:55:28.261181+00:00'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CirculationLogComponent,
        DateTranslatePipe
      ],
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        RecordModule
      ],
      providers: [ BsModalService, BsLocaleService ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CirculationLogComponent);
    component = fixture.componentInstance;
    component.record = record;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
