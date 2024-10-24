/*
 * RERO ILS UI
 * Copyright (C) 2019-2024 RERO
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
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormlyModule } from '@ngx-formly/core';
import { TranslateModule } from '@ngx-translate/core';
import { RecordModule, RecordService, RecordUiService } from '@rero/ng-core';
import { of } from 'rxjs';
import { EditorService } from '../../../service/editor.service';
import { DocumentEditorComponent } from './document-editor.component';

const recordTestingUiService = jasmine.createSpyObj('RecordUiService', [
  'getResourceConfig'
]);
recordTestingUiService.getResourceConfig.and.returnValue({ key: 'documents' });
recordTestingUiService.types = [
  {
    key: 'documents',
  }
];

const testingRoute = {
  params: of({ type: 'documents' }),
  snapshot: {
    params: { type: 'documents' },
    data: {
      types: [
        {
          key: 'documents',
        }
      ],
      showSearchInput: true
    }
  },
  queryParams: of({})
};

const recordTestingService = jasmine.createSpyObj('RecordService', ['getSchemaForm']);
recordTestingService.getSchemaForm.and.returnValue(of({
  schema: {
    type: 'object',
    additionalProperties: true,
    properties: {}
  }
}));

describe('DocumentEditorComponent', () => {
  let component: DocumentEditorComponent;
  let fixture: ComponentFixture<DocumentEditorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        DocumentEditorComponent
      ],
      imports: [
        HttpClientTestingModule,
        RouterModule.forRoot([]),
        TranslateModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        FormlyModule.forRoot({}),
        RecordModule,
        BrowserAnimationsModule
      ],
      providers: [
        EditorService,
        { provide: RecordService, useValue: recordTestingService },
        { provide: RecordUiService, useValue: recordTestingUiService },
        { provide: ActivatedRoute, useValue: testingRoute }
      ]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
