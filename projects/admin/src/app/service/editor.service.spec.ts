import { TestBed } from '@angular/core/testing';

import { EditorService } from './editor.service';
import { HttpClientModule } from '@angular/common/http';

describe('EditorService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientModule
    ],
    providers: [
    ]
  }));

  it('should be created', () => {
    const service: EditorService = TestBed.get(EditorService);
    expect(service).toBeTruthy();
  });
});
