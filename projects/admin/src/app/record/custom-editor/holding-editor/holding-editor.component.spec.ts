import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HoldingEditorComponent } from './holding-editor.component';
import { RecordModule, RecordService } from '@rero/ng-core';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateService, TranslateModule, TranslateLoader, TranslateFakeLoader } from '@ngx-translate/core';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';

describe('HoldingEditorComponent', () => {
  let component: HoldingEditorComponent;
  let fixture: ComponentFixture<HoldingEditorComponent>;
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
        type: 'holdings', pid: '1'
      }),
      data: {
        types: [
          {
            key: 'holdings',
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
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }
        }),
        RecordModule,
        HttpClientModule,
        RouterTestingModule
      ],
      declarations: [ HoldingEditorComponent ],
      providers: [
        TranslateService,
        { provide: RecordService, useValue: recordService },
        { provide: ActivatedRoute, useValue: route }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HoldingEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
