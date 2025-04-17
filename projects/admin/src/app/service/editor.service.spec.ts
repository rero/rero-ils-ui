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

  const httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post']);
  httpClientSpy.get.and.returnValue(of(record));
  httpClientSpy.post.and.returnValue(of({ issues }));

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
