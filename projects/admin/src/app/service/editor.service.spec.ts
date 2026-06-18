// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { TestBed } from "@angular/core/testing";
import { EditorService } from "./editor.service";
import { HttpClient } from "@angular/common/http";
import { of } from "rxjs";
import { PredictionIssue } from "./holdings.service";

describe('EditorService', () => {
  let service: EditorService;

  const record = {
    metadata: {
      pid: '1'
    }
  };

  const issues: PredictionIssue[] = [
    { issue: 'issue 1', expected_date: '2025-04-22 14:00:00' },
    { issue: 'issue 2', expected_date: '2025-04-22 14:00:00' }
  ];

  const httpClientSpy = { get: vi.fn(), post: vi.fn() };
  httpClientSpy.get.mockReturnValue(of(record));
  httpClientSpy.post.mockReturnValue(of({ issues }));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EditorService,
        { provide: HttpClient, useValue: httpClientSpy }
      ]
    });

    service = TestBed.inject(EditorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return the record according to its source and id', () => {
    service.getRecordFromExternal('bnf', 'Q1231')
      .subscribe((result: any) => expect(result).toEqual(record));
  });

  it('should return a holdings prediction', () => {
    const data = {
      patterns: '/patterns/'
    };
    service.getHoldingPatternPreview(data)
      .subscribe((result: PredictionIssue[]) => {
        expect(result.length).toEqual(2);
        expect(result[0].issue).toEqual('issue 1');
      });
  });
});
