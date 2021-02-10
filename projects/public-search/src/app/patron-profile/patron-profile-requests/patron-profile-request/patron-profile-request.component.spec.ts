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
import { SharedModule } from '@rero/shared';
import { ToastrModule } from 'ngx-toastr';
import { UserService } from '../../../user.service';
import { PatronProfileRequestComponent } from './patron-profile-request.component';


describe('PatronProfileRequestComponent', () => {
  let component: PatronProfileRequestComponent;
  let fixture: ComponentFixture<PatronProfileRequestComponent>;

  const record = {
    metadata: {
      pid: '1',
      document: {
        pid: '1',
        title: [{ type: 'bf:Title', _text: 'Document title' }]
      },
      pickup_name: 'Pickup name',
      state: 'ITEM_AT_DESK',
      rank: 3
    }
  };


  const userServiceSpy = jasmine.createSpyObj('UserService', ['']);
  userServiceSpy.user = { organisation: { code: 'org1' }};

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ PatronProfileRequestComponent ],
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        ToastrModule.forRoot(),
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
    fixture = TestBed.createComponent(PatronProfileRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the document information button and link', () => {
    component.record = record;
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button');
    expect(button.attributes.id.textContent).toContain('request-1');

    const documentLink = fixture.nativeElement.querySelector('a');
    expect(documentLink.attributes.href.textContent).toContain('/org1/documents/1');
    expect(documentLink.textContent).toContain('Document title');

    const pickupName = fixture.nativeElement.querySelectorAll('div')[2];
    expect(pickupName.textContent).toContain('Pickup name');
  });

  it('should display the loan with ITEM_AT_DESK state', () => {
    record.metadata.state = 'ITEM_AT_DESK';
    component.record = record;
    fixture.detectChanges();
    const div = fixture.nativeElement.querySelectorAll('div')[3];
    expect(div.textContent).toContain('to pick up');
  });

  it('should display the loan with PENDING state', () => {
    record.metadata.state = 'PENDING';
    component.record = record;
    fixture.detectChanges();
    const div = fixture.nativeElement.querySelectorAll('div')[3];
    expect(div.textContent).toContain('waiting (position {{ rank }} in waiting list)');
    const button = fixture.nativeElement.querySelector('button#request-cancel-1');
    expect(button.textContent).toContain('Cancel');
  });
});
