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
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { CirculationModule } from '../../circulation.module';
import { CheckinActionComponent } from './checkin-action.component';


describe('CheckinActionComponent', () => {
  let component: CheckinActionComponent;
  let fixture: ComponentFixture<CheckinActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CirculationModule,
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        RouterTestingModule
      ],
      declarations: [ CheckinActionComponent ]
    })
    .compileComponents();
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
    const itemButton: DebugElement = fixture.debugElement.query(By.css('button[id=action-item]'));
    itemButton.triggerEventHandler('click', null);
    expect(component.action).toEqual('item');
  });

  it('should return the patron action with a click on the button Patron account', () => {
    const itemButton: DebugElement = fixture.debugElement.query(By.css('button[id=action-patron]'));
    itemButton.triggerEventHandler('click', null);
    expect(component.action).toEqual('patron');
  });
});
