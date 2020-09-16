/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppRouterEventService } from './app-router-event.service';

describe('Service: AppRouterEvent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      providers: [AppRouterEventService]
    });
  });

  it('should ...', inject([AppRouterEventService], (service: AppRouterEventService) => {
    expect(service).toBeTruthy();
  }));
});
