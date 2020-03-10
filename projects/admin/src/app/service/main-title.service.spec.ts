import { TestBed } from '@angular/core/testing';

import { MainTitleService } from './main-title.service';

describe('MainTitleService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MainTitleService = TestBed.get(MainTitleService);
    expect(service).toBeTruthy();
  });
});
