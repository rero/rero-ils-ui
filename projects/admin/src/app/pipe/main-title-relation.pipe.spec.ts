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
import { MainTitleRelationPipe } from './main-title-relation.pipe';

describe('MainTitleRelationPipe', () => {
  const title = [
      {
          mainTitle: [{value: 'J. Am. Med. Assoc.'}],
          type: 'bf:AbbreviatedTitle'
      },
      {
          mainTitle: [{value: 'J Am Med Assoc'}],
          type: 'bf:KeyTitle'
      },
      {
          _text: 'Journal of the American medical association',
          mainTitle: [{
              value: 'Journal of the American medical association'
          }],
          type: 'bf:Title'
      }
  ];

  it('create an instance', () => {
    const pipe = new MainTitleRelationPipe();
    expect(pipe).toBeTruthy();
  });

  it('should return only the main title', () => {
    const pipe = new MainTitleRelationPipe();
    expect(pipe.transform(title)).toContain('Journal of the American medical association');
  });
});
