/*
 * RERO ILS UI
 * Copyright (C) 2020 RERO
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
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, convertToParamMap, Router, UrlSegment } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RecordModule, RecordService } from '@rero/ng-core';
import { of } from 'rxjs';
import { DocumentRecordSearchComponent } from './document-record-search.component';

describe('DocumentRecordSearchComponent', () => {
  let component: DocumentRecordSearchComponent;
  let fixture: ComponentFixture<DocumentRecordSearchComponent>;

  const emptyRecords = {
    aggregations: {},
    hits: {
      total: {
        relation: 'eq',
        value: 0
      },
      hits: []
    },
    links: {}
  };

  const recordServiceSpy = jasmine.createSpyObj('RecordService', ['getRecords', 'totalHits']);
  recordServiceSpy.getRecords.and.returnValue(of(emptyRecords));
  recordServiceSpy.totalHits.and.returnValue(0);

  const routerSpy = jasmine.createSpyObj('Router', ['navigate', 'parseUrl']);
  routerSpy.navigate.and.returnValue(of(false));
  routerSpy.url = '';
  routerSpy.parseUrl.and.returnValue({
    root: {
      children: {
        primary: {
          segments: [
            new UrlSegment('aoste', {}),
            new UrlSegment('search', {}),
            new UrlSegment('documents', {}),
          ]
        }
      }
    }
  });

  const route = {
    snapshot: {
      data: {
        detailUrl: '/custom/url/for/detail/:type/:pid',
        types: [
          {
            key: 'documents'
          }
        ],
        showSearchInput: true,
        // TODO: if can is setted true, this test failed.
        adminMode: () => of({
          can: false,
          message: ''
        })
      },
      queryParams: { q: '', page: 1, size: 10 },
      params: { type: 'documents' }
    },
    queryParamMap: of(convertToParamMap({
      q: '',
      page: 1,
      size: 10
    })),
    paramMap: of(convertToParamMap({ type: 'documents' })),
    queryParams: of({})
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RecordModule,
        BrowserAnimationsModule,
        RouterTestingModule,
        HttpClientTestingModule,
        TranslateModule.forRoot()
      ],
      declarations: [
        DocumentRecordSearchComponent
      ],
      providers: [
        { provide: RecordService, useValue: recordServiceSpy },
        { provide: ActivatedRoute, useValue: route },
        { provide: Router, useValue: routerSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentRecordSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
