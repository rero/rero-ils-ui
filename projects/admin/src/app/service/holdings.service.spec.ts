/*
 * RERO ILS UI
 * Copyright (C) 2025 RERO
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, version 3 of the License.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

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

  const httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post']);

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
    httpClientSpy.get.and.returnValue(of({ issues }));
    service.getHoldingPatternPreview('1')
      .subscribe((result: PredictionIssue[]) => expect(result[0].issue).toEqual('issue 2'));
  });

  it('should create an issue on a holdings', () => {
    httpClientSpy.post.and.returnValue(of({}));
    service.quickReceivedIssue('1')
      .subscribe((result: any) => expect(result).toEqual({}))
  });

  it('should return the icon classes', () => {
    expect(service.getIcon(IssueItemStatus.DELETED)).toEqual('fa-circle text-error');
    expect(service.getIcon(IssueItemStatus.RECEIVED)).toEqual('fa-circle text-success');
    expect(service.getIcon(IssueItemStatus.LATE)).toEqual('fa-envelope-open-o text-warning');
    expect(service.getIcon(IssueItemStatus.EXPECTED)).toEqual('fa-circle text-secondary');
  });

  it('should return true on the possibility of making a request', () => {
    httpClientSpy.get.and.returnValue(of(true));
    service.canRequest('pid').subscribe((result: any) => expect(result).toBeTrue());
  });

  it('should return a list of pickup locations', () => {
    httpClientSpy.get.and.returnValue(of({ locations }));
    service.getPickupLocations('1').subscribe((result: any) => expect(result).toEqual([]));
  })
});
