// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { TranslateModule } from '@ngx-translate/core';

import { AppComponent } from './app.component';


describe('AppComponent', () => {
  beforeEach(async () => {
    TestBed.configureTestingModule({
    imports: [RouterModule.forRoot([]),
        TranslateModule.forRoot({}),
        LoadingBarModule,
         AppComponent],
    providers: [provideHttpClient()]
}).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
});
