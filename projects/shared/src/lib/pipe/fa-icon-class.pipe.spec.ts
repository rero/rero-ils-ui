/*
 * RERO ILS UI
 * Copyright (C) 2019-2024 RERO
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
import { FaIconClassPipe } from './fa-icon-class.pipe';

describe('FaIconClassPipe', () => {
  let pipe: FaIconClassPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FaIconClassPipe
      ]
    });

    pipe = TestBed.inject(FaIconClassPipe);
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('found pdf', () => {
    expect(
      pipe.transform('application/pdf', 'file')
    ).toEqual('fa-file-pdf-o');
  });

  it('found default', () => {
    expect(
      pipe.transform('application/page', 'file')
    ).toEqual('fa-file-o');
  });
});
