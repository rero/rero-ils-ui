// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { PartOfComponent } from './part-of.component';

describe('PartOfComponent', () => {
  let component: PartOfComponent;
  let fixture: ComponentFixture<PartOfComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
    imports: [
        TranslateModule.forRoot({}),
        RouterModule,
        PartOfComponent
    ],
    providers: [
        provideHttpClient(),
        provideHttpClientTesting()
    ]
}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartOfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
