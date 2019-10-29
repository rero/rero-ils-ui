import { TestBed } from '@angular/core/testing';

import { EditorService } from './editor.service';
import { HttpClientModule } from '@angular/common/http';
import { CustomBootstrap4Framework } from '@rero/ng-core';

describe('EditorService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientModule
    ],
    providers: [
      CustomBootstrap4Framework
    ]
  }));

  it('should be created', () => {
    const service: EditorService = TestBed.get(EditorService);
    expect(service).toBeTruthy();
  });
});
