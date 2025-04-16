/*
 * RERO ILS UI
 * Copyright (C) 2019-2025 RERO
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
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RecordModule } from '@rero/ng-core';
import { SharedModule } from '@rero/shared';
import { DocumentBriefComponent } from './document-brief.component';


describe('DocumentBriefComponent', () => {
  let component: DocumentBriefComponent;
  let fixture: ComponentFixture<DocumentBriefComponent>;

  const record = {
    metadata: {
      type: [
        { main_type: 'main' }
      ],
      title: [
        { type: 'bf:Title', _text: 'Document title' }
      ]
    }
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
          DocumentBriefComponent
      ],
      imports: [
        RecordModule,
        TranslateModule.forRoot(),
        SharedModule
      ],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentBriefComponent);
    component = fixture.componentInstance;
    component.detailUrl = { link: '/foo', external: false };
    component.viewcode = 'global';
    component.record = record
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should contain the information in the document', () => {
    const title = fixture.nativeElement.querySelector('h4');
    expect(title.textContent).toEqual('Document title');
  });
});
