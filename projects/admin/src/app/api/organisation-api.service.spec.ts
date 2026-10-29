// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
import { provideHttpClient, withXhr } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { RecordService } from '@rero/ng-core';
import { of } from 'rxjs';

import { OrganisationApiService } from './organisation-api.service';

describe('OrganisationApiService', () => {
  let service: OrganisationApiService;

  const response = {
    metadata: {
      name: 'Organisation name',
    },
  };
  const recordServiceSpy = { getRecord: vi.fn() };
  recordServiceSpy.getRecord.mockReturnValue(of(response));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideTranslateService(),
        { provide: RecordService, useValue: recordServiceSpy },
        provideHttpClient(withXhr()),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(OrganisationApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it("should return the organization's data", () => {
    service.getByPid('1').subscribe((data: any) => {
      expect(data).toEqual(response.metadata);
    });
  });
});
