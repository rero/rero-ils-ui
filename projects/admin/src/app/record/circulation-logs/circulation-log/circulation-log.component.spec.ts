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
import { TranslateModule } from '@ngx-translate/core';
import { DateTranslatePipe, RecordModule } from '@rero/ng-core';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { UserService } from '@rero/shared';
import { userTestingService } from 'projects/admin/tests/utils';
import { CirculationLogComponent } from './circulation-log.component';


describe('CirculationLogComponent', () => {
  let component: CirculationLogComponent;
  let fixture: ComponentFixture<CirculationLogComponent>;

  const record = { metadata: {
    date: '2021-07-06T06:40:24.015413+00:00',
    library: { type: 'lib', value: '4' },
    loan: {
        item: {
            call_number: '00437',
            category: 'standard',
            document: {
                pid: '2000017',
                title: 'Les maléfices d\'Halequin',
                type: 'docsubtype_other_book'
            },
            holding: { location_name: 'Magasin A', pid: '424' },
            library_pid: '1',
            pid: '437'
        },
        override_flag: false,
        patron: {
            age: 40,
            gender: 'other',
            hashed_pid: '6512bd43d9caa6e02c990b0a82652dca',
            name: 'Carron, Katie',
            pid: '11',
            postal_code: '1920',
            type: 'Standard'
        },
        pickup_location: { name: 'Espaces publics', pid: '11' },
        pid: '211',
        transaction_channel: 'system',
        transaction_location: { name: 'Espaces publics', pid: '13' },
        transaction_user: { name: 'Müller, Astrid', pid: '1' },
        trigger: 'request'
    },
    operation: 'create',
    organisation: { type: 'org', value: '1' },
    pid: '0b30c55e-de25-11eb-b1b4-8c859092e74d',
    record: { type: 'loan', value: '211' },
    user: { type: 'ptrn', value: '1' },
    user_name: 'Müller, Astrid'
}};

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
      providers: [
          { provide: UserService, useValue: userTestingService },
          BsLocaleService
      ]
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
