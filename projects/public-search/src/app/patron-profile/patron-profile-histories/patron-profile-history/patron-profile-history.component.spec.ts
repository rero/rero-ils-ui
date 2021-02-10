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
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CoreModule } from '@rero/ng-core';
import { SharedModule } from '@rero/shared';
import { ContributionFilterPipe } from '../../../pipe/contribution-filter.pipe';
import { UserService } from '../../../user.service';
import { PatronProfileHistoryComponent } from './patron-profile-history.component';


describe('PatronProfileHistoryComponent', () => {
  let component: PatronProfileHistoryComponent;
  let fixture: ComponentFixture<PatronProfileHistoryComponent>;
  let translate: TranslateService;

  const record = {
    metadata: {
      pid: '1',
      start_date: '2021-02-02 14:00:00',
      end_date: '2021-03-10 12:00:00',
      transaction_library_name: 'Trans. library name',
      pickup_library_name: 'Pickup library name',
      document: {
        pid: '1',
        title: [{ type: 'bf:Title', _text: 'Document title' }],
        contribution: [
          {
            agent: {
              pid: '5',
              type: 'bf:Person',
              authorized_access_point_en: 'contribution EN',
              authorized_access_point_fr: 'contribution FR'
            },
            role: 'author'
          }
        ]
      }
    }
  };

  const userServiceSpy = jasmine.createSpyObj('UserService', ['']);
  userServiceSpy.user = { organisation: { code: 'org1'}};

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        PatronProfileHistoryComponent,
        ContributionFilterPipe
      ],
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        CoreModule,
        SharedModule
      ],
      providers: [
        { provide: UserService, useValue: userServiceSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    translate = TestBed.inject(TranslateService);
    translate.use('en');
    fixture = TestBed.createComponent(PatronProfileHistoryComponent);
    component = fixture.componentInstance;
    component.isCollapsed = false;
    component.record = record;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the document information button and link', () => {
    const button = fixture.nativeElement.querySelector('button');
    expect(button.attributes.id.textContent).toContain('history-1');

    const historyEndDate = fixture.nativeElement.querySelectorAll('div.event-timestamp');
    expect(historyEndDate[0].textContent).toContain('3/10/21');

    const eventContent = fixture.nativeElement.querySelectorAll('.event-content');
    const checkin = eventContent[0].querySelectorAll('div');
    expect(checkin[1].textContent).toContain('Checkin');
    expect(checkin[2].textContent).toContain('Trans. library name');

    expect(historyEndDate[1].textContent).toContain('2/2/21');
    const checkout = eventContent[1].querySelectorAll('div');
    expect(checkout[1].textContent).toContain('Checkout');
    expect(checkout[2].textContent).toContain('Pickup library name');
  });
});
