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
import { MarcPipe } from "./marc.pipe";

describe('MarcPipe', () => {
  let pipe: MarcPipe;

  const marcLeader = ['leader', '     cam  22        450 '];
  const marc210 = ['210 __', [
    ['a', 'Saint-Denis (Seine-Saint-Denis)'],
    ['c', 'ASE-MELH'],
    ['d', '1999'],
    ['e', '61-Alençon'],
    ['g', 'Impr. alençonnaise']
  ]];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MarcPipe
      ]
    });

    pipe = TestBed.inject(MarcPipe);
  });

  it('should be created', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return a Marc object', () => {
    expect(pipe.transform(marcLeader)).toEqual({
      field: 'leader',
      value: '     cam  22        450 '
    });

    expect(pipe.transform(marc210)).toEqual({
      field: '210',
      ind1: '_',
      ind2: '_',
      value: '$a Saint-Denis (Seine-Saint-Denis) $c ASE-MELH $d 1999 $e 61-Alençon $g Impr. alençonnaise'
    });
  });


});
