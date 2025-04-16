/*
 * RERO ILS UI
 * Copyright (C) 2021-2025 RERO
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
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CheckinActionComponent } from './checkin-action.component';


describe('CheckinActionComponent', () => {
  let component: CheckinActionComponent;
  let fixture: ComponentFixture<CheckinActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CheckinActionComponent],
      imports: [
        TranslateModule.forRoot(),
        RouterModule,
        ButtonModule,
        DynamicDialogModule
      ],
      providers: [
        DynamicDialogRef,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckinActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return the item action with a click on the button Check the item', () => {
    const itemButton: DebugElement = fixture.debugElement.query(By.css('p-button[id=action-item] > button'));
    itemButton.triggerEventHandler('click', null);
    expect(component.action).toEqual('item');
  });

  it('should return the patron action with a click on the button Patron account', () => {
    const itemButton: DebugElement = fixture.debugElement.query(By.css('p-button[id=action-patron] > button'));
    itemButton.triggerEventHandler('click', null);
    expect(component.action).toEqual('patron');
  });
});
