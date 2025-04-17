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
import { CirculationService } from "./circulation.service";

describe('CirculationService', () => {
  let service: CirculationService;

  const stats = {
    loan: 2,
    request: 3
  };

  const messages = [
    {severity: 'success', detail: 'added loan'},
    {severity: 'error', detail: 'error loan'}
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CirculationService
      ]
    });

    service = TestBed.inject(CirculationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have statistics with numerical values', () => {
    Object.keys(stats).forEach((key: string) => {
      service.statisticsIncrease(key, stats[key]);
    });
    expect(service.statistics()).toEqual(stats);

    service.statisticsIncrease('loan', 2);
    expect(service.statistics().loan).toEqual(4);
  });

  it('should raise an exception if the key doesn\'t exist', () => {
    expect(() => service.statisticsDecrease('loan', 1))
      .toThrowError('The statistical "loan" key doesn\'t exist');
  });

  it('should raise an exception if the number is greater than', () => {
    service.statistics.set(stats);
    expect(() => service.statisticsDecrease('loan', 6))
      .toThrowError('The decrease value of "loan" is greater than the statistical value');
  });

  it('should decrement a value of statistics', () => {
    service.statistics.set(stats);
    service.statisticsDecrease('request', 1);
    expect(service.statistics().request).toEqual(2);
  });

  it('should add circulation messages', () => {
    messages.forEach((message) => {
      service.addCirculationMessage(message);
    });
    expect(service.messages().length).toEqual(2);
    expect(service.messages()).toEqual(messages);
  });

  it('should empty statistics and messages', () => {
    service.statistics.set(stats);
    service.messages.set(messages);
    expect(service.statistics()).toEqual(stats);
    expect(service.messages()).toEqual(messages);
    service.clear();
    expect(service.statistics()).toEqual({});
    expect(service.messages()).toEqual([]);
  });
});
