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
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ArrayTranslatePipe } from './array-translate.pipe';

describe('ArrayTranslatePipe', () => {
  let pipe: ArrayTranslatePipe;

  const translateServiceSpy = jasmine.createSpyObj('TranslateService', ['instant']);
  translateServiceSpy.instant.and.returnValue('foobar');

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot()
      ],
      providers: [
        ArrayTranslatePipe,
        { provide: TranslateService, useValue: translateServiceSpy }
      ]
    });
    pipe = TestBed.inject(ArrayTranslatePipe);
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should translate the strings in the array', () => {
    expect(pipe.transform(['foo', 'bar'])).toEqual(['foobar', 'foobar']);
  });
});
