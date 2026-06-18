// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
import { TestBed } from '@angular/core/testing';
import { RecordService } from '@rero/ng-core';
import { of } from 'rxjs';
import { OrganisationApiService } from './organisation-api.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { provideHttpClient } from '@angular/common/http';

describe('OrganisationApiService', () => {
  let service: OrganisationApiService;

  const response = {
    metadata: {
      name: 'Organisation name'
    }
  }
  const recordServiceSpy = { getRecord: vi.fn() };
  recordServiceSpy.getRecord.mockReturnValue(of(response));

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot()
      ],
      providers: [
          { provide: RecordService, useValue: recordServiceSpy },
          provideHttpClient(),
          provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(OrganisationApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return the organization\'s data', () => {
    service.getByPid('1').subscribe((data: any) => {
      expect(data).toEqual(response.metadata);
    });

  });
});
