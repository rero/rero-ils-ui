/*
 * RERO ILS UI
 * Copyright (C) 2019 RERO
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

import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RecordModule } from '@rero/ng-core';
import { SharedModule } from '@rero/shared';
import { AppRoutingModule } from '../app-routing.module';
import { ErrorPageComponent } from '../error/error-page.component';
import { MainComponent } from '../main/main.component';
import { DocumentBriefComponent } from './document-brief.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';


describe('DocumentBriefComponent', () => {
  let component: DocumentBriefComponent;
  let fixture: ComponentFixture<DocumentBriefComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [
        DocumentBriefComponent,
        MainComponent,
        ErrorPageComponent
    ],
    imports: [RecordModule,
        TranslateModule.forRoot(),
        AppRoutingModule,
        SharedModule],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentBriefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
