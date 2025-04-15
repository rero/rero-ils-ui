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
import { IdentifiedByLabelPipe } from "./identifiedby-label.pipe";

describe('IdentifiedByLabelPipe', () => {
  let pipe: IdentifiedByLabelPipe;

  const identifiedBy = [
    { type: 'isbn', value: 'ISBN' },
    { type: 'isbn', value: 'ISBN2' },
    { type: 'issn', value: 'ISSN' },
    { type: 'ean', value: 'EAN' },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IdentifiedByLabelPipe]
    });
    pipe = TestBed.inject(IdentifiedByLabelPipe);
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return all identifiers', () => {
    expect(pipe.transform(identifiedBy)).toEqual('ISBN, ISBN2, ISSN, EAN');
  });

  it('should return isbn and ean identifiers', () => {
    expect(pipe.transform(identifiedBy, ['isbn', 'ean'])).toEqual('ISBN, ISBN2, EAN')
  });

  it('should return all isbn separated by semicolons', () => {
    expect(pipe.transform(identifiedBy, ['isbn'], '; ')).toEqual('ISBN; ISBN2')
  });
});
