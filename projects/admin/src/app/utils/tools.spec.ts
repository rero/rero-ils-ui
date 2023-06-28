/*
 * RERO ILS UI
 * Copyright (C) 2019-2023 RERO
 * Copyright (C) 2019-2023 UCLouvain
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
import { Tools } from "./tools";

describe('Tools', () => {

  it('should return a query', () => {
    const query = [
      'contribution.entity.pids.foo:x11',
      'subjects.entity.pids.foo:x11',
      'genreForm.entity.pids.foo:x11'
    ].join(' OR ');
    expect(Tools.generateEntitySearchQuery('foo', 'x11')).toEqual(query);
  });

});
