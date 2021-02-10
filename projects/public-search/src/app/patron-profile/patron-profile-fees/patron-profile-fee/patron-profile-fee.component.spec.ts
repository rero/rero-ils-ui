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
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { CoreModule } from '@rero/ng-core';
import { MainTitlePipe } from '@rero/shared';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { of } from 'rxjs';
import { PatronTransactionEventApiService } from '../../../api/patron-transaction-event-api.service';
import { UserService } from '../../../user.service';
import { PatronProfileFeeComponent } from './patron-profile-fee.component';


describe('PatronProfileFeeComponent', () => {
  let component: PatronProfileFeeComponent;
  let fixture: ComponentFixture<PatronProfileFeeComponent>;

  const record = {
    metadata: {
      pid: '1',
      creation_date: '2021-02-02 12:00:00',
      type: 'fee-type',
      total_amount: 2.50,
      note: 'record note',
      document: {
        pid: '1',
        title: [{ type: 'bf:Title', _text: 'Document title' }]
      },
      loan: {
        transaction_date: '2021-03-02 12:00:00',
        item: {
          call_number: 'A123456'
        }
      }
    }
  };

  const apiResponse = {
    aggregations: {},
    hits: {
      total: {
        relation: 'eq',
        value: 1
      },
      hits: [
        {
          metadata: {
            creation_date: '2021-02-02 12:00:00',
            type: 'subscription',
            subtype: 'sub',
            amount: '10',
            note: 'event note',
            library: {
              name: 'library name'
            }
          }
        }
      ]
    },
    links: {}
  };

  const user = {
    organisation: {
      code: 'org1',
      currency: 'EUR'
    }
  };

  const userServiceSpy = jasmine.createSpyObj('UserService', ['']);
  userServiceSpy.user = user;

  const patronTransactionEventsApiServiceSpy = jasmine.createSpyObj('PatronTransactionEventApiService', ['getEvents']);
  patronTransactionEventsApiServiceSpy.getEvents.and.returnValue(of(apiResponse));

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        PatronProfileFeeComponent,
        MainTitlePipe
      ],
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        CoreModule
      ],
      providers: [
        BsLocaleService,
        { provide: UserService, useValue: userServiceSpy },
        { provide: PatronTransactionEventApiService, useValue: patronTransactionEventsApiServiceSpy}
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatronProfileFeeComponent);
    component = fixture.componentInstance;
    component.record = record;
    component.isCollapsed = false;
    component.expanded('1');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the document information button and link', () => {
    const button = fixture.nativeElement.querySelector('button');
    expect(button.attributes.id.textContent).toContain('fee-1');

    const date = fixture.nativeElement.querySelector('div > div');
    expect(date.textContent).toContain('2/2/21, 12:00 PM');

    const divs = fixture.nativeElement.querySelectorAll('div > div');
    expect(divs[2].textContent).toContain('fee-type');
    expect(divs[3].textContent).toContain('€2.50');

    const note = fixture.nativeElement.querySelector('#fee-note-1');
    expect(note.textContent).toContain('Note record note');
    expect(note.querySelector('h5').textContent).toContain('Note');

    const dd = fixture.nativeElement.querySelectorAll('#fee-1-document > dl > dd');
    const docWithLink = dd[0].querySelector('a');
    expect(docWithLink.attributes.href.textContent).toContain('/org1/documents/1');
    expect(docWithLink.textContent).toContain('Document title');
    expect(dd[1].textContent).toContain('A123456');
    expect(dd[2].textContent).toContain('3/2/21, 12:00 PM');

    let event = fixture.nativeElement.querySelector('#fee-1-transaction .event-timestamp');
    expect(event.textContent).toContain('2/2/21  12:00');

    event = fixture.nativeElement.querySelectorAll('#fee-1-transaction .event-content > div > div');
    expect(event[0].textContent).toContain('subscription  [sub]');
    expect(event[1].textContent).toContain('€10.00');

    event = fixture.nativeElement
      .querySelector('#fee-1-transaction .event-content > div > div:nth-child(3) > div:nth-child(2)');
    expect(event.textContent).toContain('event note');

    event = fixture.nativeElement
      .querySelector('#fee-1-transaction .event-content > div > div:nth-child(4) > div:nth-child(2)');
    expect(event.textContent).toContain('library name');
  });
});
