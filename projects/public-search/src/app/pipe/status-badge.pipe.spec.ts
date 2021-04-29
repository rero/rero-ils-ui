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
import { StatusBadgePipe } from './status-badge.pipe';

describe('StatusBadgePipe', () => {
  let pipe: StatusBadgePipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        StatusBadgePipe
      ]
    });
    pipe = TestBed.inject(StatusBadgePipe);
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('Should return the "badge-secondary" class', () => {
    expect(pipe.transform('pending')).toEqual('badge-secondary');
  });

  it('Should return the "badge-light" class (default)', () => {
    expect(pipe.transform('missing')).toEqual('badge-light');
  });
});
