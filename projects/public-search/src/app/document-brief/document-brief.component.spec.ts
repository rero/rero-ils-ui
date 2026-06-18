// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [
        TranslateModule.forRoot(),
        DocumentBriefComponent
    ],
    providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ActivatedRoute, useValue: { params: of({ viewcode: 'global' }) } }
    ]
}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentBriefComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('detailUrl', { link: '/foo', external: false });
    fixture.componentRef.setInput('type', 'main');
    fixture.componentRef.setInput('record', record);
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
