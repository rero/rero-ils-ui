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
import { Nl2brPipe } from '@rero/ng-core';
import { of } from 'rxjs';
import { PatronApiService } from '../../api/patron-api.service';
import { PatronProfileMessageComponent } from './patron-profile-message.component';


describe('PatronProfileMessageComponent', () => {
  let component: PatronProfileMessageComponent;
  let fixture: ComponentFixture<PatronProfileMessageComponent>;

  const messages = [
    { type: 'success', content: 'Message 1' },
    { type: 'warning', content: 'Message 2' }
  ];

  const patronApiServiceSpy = jasmine.createSpyObj('PatronApiService', ['getMessages']);
  patronApiServiceSpy.getMessages.and.returnValue(of(messages));

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        PatronProfileMessageComponent,
        Nl2brPipe
      ],
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        { provide: PatronApiService, useValue: patronApiServiceSpy }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatronProfileMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all messages', () => {
    let message = fixture.nativeElement.querySelectorAll('div')[0];
    expect(message.attributes.class.textContent).toContain('alert-success');
    expect(message.textContent).toContain('Message 1');
    message = fixture.nativeElement.querySelectorAll('div')[1];
    expect(message.attributes.class.textContent).toContain('alert-warning');
    expect(message.textContent).toContain('Message 2');
  });
});
