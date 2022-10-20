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

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, convertToParamMap, Router, UrlSegment } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { DialogComponent, DialogService, RecordModule, RecordService } from '@rero/ng-core';
import { of } from 'rxjs';
import { SharedModule } from '@rero/shared';
import { DocumentRecordSearchComponent } from './document-record-search.component';


describe('RecordSearchComponent', () => {
  let component: DocumentRecordSearchComponent;
  let fixture: ComponentFixture<DocumentRecordSearchComponent>;

  const routerSpy = jasmine.createSpyObj('Router', ['navigate', 'parseUrl']);
  routerSpy.url = '';
  routerSpy.parseUrl.and.returnValue({
    root: {
      children: {
        primary: {
          segments: [
            new UrlSegment('records', {}),
            new UrlSegment('documents', {}),
          ]
        }
      }
    }
  });

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

  const recordServiceSpy = jasmine.createSpyObj('RecordService', ['getRecords', 'delete', 'totalHits']);
  recordServiceSpy.getRecords.and.returnValue(of(emptyRecords));
  recordServiceSpy.delete.and.returnValue(of({}));
  recordServiceSpy.totalHits.and.returnValue(0);

  const dialogServiceSpy = jasmine.createSpyObj('DialogService', ['show']);
  dialogServiceSpy.show.and.returnValue(of(true));

  const route = {
    snapshot: {
      data: {
        detailUrl: '/custom/url/for/detail/:type/:pid',
        types: [
          {
            key: 'documents'
          },
          {
            key: 'organisations'
          }
        ],
        showSearchInput: true,
        adminMode: () => of({
          can: false,
          message: ''
        })
      },
      queryParams: { organisation: 1 },
      params: { type: 'documents' }
    },
    queryParamMap: of(convertToParamMap({
      q: '',
      page: 1,
      size: 10,
      author: ['Filippini, Massimo']
    })),
    paramMap: of(convertToParamMap({ type: 'documents' })),
    queryParams: of({})
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        DocumentRecordSearchComponent
      ],
      imports: [
        BrowserAnimationsModule,
        RecordModule,
        RouterTestingModule,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }
        }),
        SharedModule
      ],
      providers: [
        { provide: RecordService, useValue: recordServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: route },
        { provide: DialogService, useValue: dialogServiceSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .overrideModule(BrowserDynamicTestingModule, {
        set: {
          entryComponents: [DialogComponent]
        }
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
