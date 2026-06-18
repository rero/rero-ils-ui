// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

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
