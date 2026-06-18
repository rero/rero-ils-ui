// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { provideHttpClient } from '@angular/common/http';
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
    imports: [
        TranslateModule.forRoot(),
        RouterModule,
        ButtonModule,
        DynamicDialogModule,
        CheckinActionComponent
    ],
    providers: [
        DynamicDialogRef,
        provideHttpClient(),
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
