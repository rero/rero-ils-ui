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
import { TestBed } from '@angular/core/testing';

import { PatronService } from '@app/admin/service/patron.service';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '@rero/shared';
import { of } from 'rxjs';
import { CirculationStatsService } from './circulation-stats.service';

describe('CirculationStatsService', () => {
  let service: CirculationStatsService;

  const patronServiceSpy = jasmine.createSpyObj('PatronService', ['getCirculationInformations']);
  patronServiceSpy.getCirculationInformations.and.returnValue(of({
    statistics: {
      PENDING: 2,
      ITEM_IN_TRANSIT_FOR_PICKUP: 2,
      ITEM_AT_DESK: 1,
      ITEM_ON_LOAN: 1,
      ill_requests: 3
    },
    messages: [
      { type: 'warning', content: 'warning message' }
    ]
  }));

  const stats = {
    feesEngaged: 0,
    fees: 0,
    overdueFees: 0,
    pending: 4,
    pickup: 1,
    loan: 1,
    ill: 3
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: PatronService, useValue: patronServiceSpy }
      ]
    });
    service = TestBed.inject(CirculationStatsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return the stats', () => {
    service.updateStats('1');
    expect(service.statistics()).toEqual(stats);
  });

  it('should clear circulation messages', () => {
    service.updateStats('1');
    expect(service.messages()).toEqual([{ severity: 'warn', detail: 'warning message'}]);
    service.clearMessages();
    expect(service.messages()).toEqual([]);
  });

  it('should return stats without history', () => {
    const statsFees = {...stats};
    service.updateStats('1');
    expect(service.statistics()).toEqual(statsFees);
  });

  it('should return stats with overdue, engaged fees and total', () => {
    const statsFees = {...stats};
    statsFees.overdueFees = 12;
    statsFees.feesEngaged = 18;
    statsFees.fees = 30;
    service.updateStats('1');
    service.setOverdueFees(12, []);
    service.setFeesEngaged(18, []);
    expect(service.statistics()).toEqual(statsFees);
  });
});
