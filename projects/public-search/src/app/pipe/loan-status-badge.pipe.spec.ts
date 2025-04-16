/*
 * RERO ILS UI
 * Copyright (C) 2021-2025 RERO
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
import { LoanStatusBadgePipe } from './loan-status-badge.pipe';

describe('LoanStatusBadgePipe', () => {
  let pipe: LoanStatusBadgePipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LoanStatusBadgePipe
      ]
    });
    pipe = TestBed.inject(LoanStatusBadgePipe);
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('Should return the "badge-secondary" class', () => {
    expect(pipe.transform('ITEM_AT_DESK')).toEqual('success');
  });

  it('Should return the "badge-light" class (default)', () => {
    expect(pipe.transform('MISSING')).toEqual('secondary');
  });
});
