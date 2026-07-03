// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { TestBed } from "@angular/core/testing";
import { HoldingsService, PredictionIssue } from "./holdings.service";
import { HttpClient } from "@angular/common/http";
import { of } from "rxjs";
import { IssueItemStatus } from "@rero/shared";

describe('HoldingsService', () => {
  let service: HoldingsService;

  const issues: PredictionIssue[] = [
    { issue: 'issue 1', expected_date: '2025-04-22 14:00:00' },
    { issue: 'issue 2', expected_date: '2025-04-22 14:00:00' }
  ];

  const locations = [];

  const httpClientSpy = { get: vi.fn(), post: vi.fn() };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HoldingsService,
        { provide: HttpClient, useValue: httpClientSpy }
      ]
    });

    service = TestBed.inject(HoldingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Should return a holdings pattern in reverse order', () => {
    httpClientSpy.get.mockReturnValue(of({ issues }));
    service.getHoldingPatternPreview('1')
      .subscribe((result: PredictionIssue[]) => expect(result[0].issue).toEqual('issue 2'));
  });

  it('should create an issue on a holdings', () => {
    httpClientSpy.post.mockReturnValue(of({}));
    service.quickReceivedIssue('1')
      .subscribe((result: any) => expect(result).toEqual({}))
  });

  it('should return the icon classes', () => {
    expect(service.getIcon(IssueItemStatus.DELETED)).toEqual('fa-solid fa-circle text-error');
    expect(service.getIcon(IssueItemStatus.RECEIVED)).toEqual('fa-solid fa-circle text-success');
    expect(service.getIcon(IssueItemStatus.LATE)).toEqual('fa-regular fa-envelope-open text-warning');
    expect(service.getIcon(IssueItemStatus.EXPECTED)).toEqual('fa-solid fa-circle text-secondary');
  });

  it('should return true on the possibility of making a request', () => {
    httpClientSpy.get.mockReturnValue(of({ can: true, reasons: {} }));
    service.canRequest('pid').subscribe((result: any) => expect(result.can).toBe(true));
  });

  it('should return a list of pickup locations', () => {
    httpClientSpy.get.mockReturnValue(of({ locations }));
    service.getPickupLocations('1').subscribe((result: any) => expect(result).toEqual([]));
  })
});
