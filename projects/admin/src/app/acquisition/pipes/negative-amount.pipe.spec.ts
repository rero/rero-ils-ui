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
import { NegativeAmountPipe } from "./negative-amount.pipe";

describe('NegativeAmountPipe', () => {
  let pipe: NegativeAmountPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NegativeAmountPipe
      ]
    });

    pipe = TestBed.inject(NegativeAmountPipe);
  });

  it('should be created', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return the negative amount', () => {
    expect(pipe.transform(1200)).toEqual(-1200);
  });
});
