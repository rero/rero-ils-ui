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
import { SharedModule } from '@rero/shared';
import { ToastrModule } from 'ngx-toastr';
import { ArrayTranslatePipe } from '../../../pipe/array-translate.pipe';
import { UserService } from '../../../user.service';
import { PatronProfileLoanComponent } from './patron-profile-loan.component';


describe('PatronProfileLoanComponent', () => {
  let component: PatronProfileLoanComponent;
  let fixture: ComponentFixture<PatronProfileLoanComponent>;

  const record = {
    metadata: {
      pid: '1',
      end_date: '2021-03-28 12:00:00',
      extension_count: 2,
      overdue: true,
      state: 'ITEM_ON_LOAN',
      renew: {
        can: true
      },
      document: {
        pid: '2',
        title: [{ type: 'bf:Title', _text: 'Document title' }]
      },
      library: {
        name: 'Library name'
      }
    }
  };
  const userServiceSpy = jasmine.createSpyObj('UserService', ['']);
  userServiceSpy.user = { organisation: { code: 'org1' }};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        PatronProfileLoanComponent,
        ArrayTranslatePipe
      ],
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        ToastrModule.forRoot(),
        SharedModule,
        CoreModule
      ],
      providers: [
        { provide: UserService, useValue: userServiceSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatronProfileLoanComponent);
    component = fixture.componentInstance;
    component.record = record;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the document information button and link', () => {
    component.record = record;
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button');
    expect(button.attributes.id.textContent).toContain('loan-1');

    const documentLink = fixture.nativeElement.querySelector('a');
    expect(documentLink.attributes.href.textContent).toContain('/org1/documents/2');
    expect(documentLink.textContent).toContain('Document title');

    const divs = fixture.nativeElement.querySelectorAll('div');
    expect(divs[2].textContent).toContain('Library name');
    expect(divs[3].textContent).toContain('3/28/21');
    expect(divs[4].textContent).toContain('2  renewals');
    expect(divs[5].textContent).toContain('overdue');
    expect(divs[6].querySelector('button').textContent).toContain('Renew');
  });

  it('should return a disabled button', () => {
    const notRenewRecord = Object.assign(record);
    notRenewRecord.metadata.renew = { can: false, reasons: ['no renew'] };
    component.record = notRenewRecord;
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelectorAll('div')[6].querySelector('button');
    expect(button.attributes.class.textContent).toContain('disabled');
  });
});


