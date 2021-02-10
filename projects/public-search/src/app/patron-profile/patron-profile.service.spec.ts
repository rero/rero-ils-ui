/*
 * RERO ILS UI
 * Copyright (C) 2021 RERO
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
import { ITabEvent, PatronProfileService } from './patron-profile.service';


describe('PatronProfileService', () => {
  let service: PatronProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PatronProfileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return the loan reference', () => {
    const loanPid = '12';
    service.cancelRequestEvent$.subscribe((loandPid: string) => {
      expect(loandPid).toEqual(loanPid);
    });
    service.cancelRequest(loanPid);
  });

  it('should return the information from the selected tab', () => {
    const tabInfo = { name: 'request', count: 12 };
    service.tabsEvent$.subscribe((event: ITabEvent) => {
      expect(event).toEqual(tabInfo);
    });
    service.changeTab(tabInfo);
  });
});
