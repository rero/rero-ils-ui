import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentEditorComponent } from './document-editor.component';
import { Bootstrap4FrameworkModule } from 'angular6-json-schema-form';
import { TranslateModule, TranslateLoader, TranslateFakeLoader, TranslateService } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { RecordModule, RecordService } from '@rero/ng-core';
import { of } from 'rxjs';
import { convertToParamMap, ActivatedRoute } from '@angular/router';

describe('DocumentEditorComponent', () => {
  let component: DocumentEditorComponent;
  let fixture: ComponentFixture<DocumentEditorComponent>;
  const recordService = jasmine.createSpyObj('RecordService', ['getSchemaForm']);
  recordService.getSchemaForm.and.returnValue(of({
    schema: {
      type: 'object',
      additionalProperties: true,
      properties: {}
    }
  }));

  const route = {
    snapshot: {
      paramMap: convertToParamMap({
        type: 'documents', pid: '1'
      }),
      data: {
        types: [
          {
            key: 'documents',
          }
        ],
        showSearchInput: true,
        adminMode: true
      }
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        Bootstrap4FrameworkModule,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }
        }),
        RecordModule,
        RouterTestingModule,
        HttpClientModule,
        ToastrModule.forRoot()
      ],
      declarations: [ DocumentEditorComponent ],
      providers: [
        TranslateService,
        { provide: RecordService, useValue: recordService },
        { provide: ActivatedRoute, useValue: route }
      ]
    })
    .compileComponents();
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
