// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { TestBed } from "@angular/core/testing";
import { ImportSourceApiService } from "./import-source-api.service";
import { HttpClient } from "@angular/common/http";
import { of } from "rxjs";
import { ExternalSourceSetting } from "../classes/external-source";

describe('ImportSourceApiService', () => {
  let service: ImportSourceApiService;

  const data = {
    key: 'import-a',
    label: 'Import A',
    weight: 100,
    endpoint: '/source/api/import'
  };

  const httpClientSpy = { get: vi.fn() };
  httpClientSpy.get.mockReturnValue(of([data]));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ImportSourceApiService,
        { provide: HttpClient, useValue: httpClientSpy }
      ]
    });

    service = TestBed.inject(ImportSourceApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a list of import sources', () => {
    service.getSources().subscribe((result: ExternalSourceSetting[]) => {
      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(ExternalSourceSetting);
    });
  });
});
