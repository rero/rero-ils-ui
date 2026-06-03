/*
 * RERO ILS UI
 * Copyright (C) 2019 RERO
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

import { of } from 'rxjs';

export const recordTestingService = {
  getRecords: vi.fn(),
  getRecord: vi.fn()
};

recordTestingService.getRecords.mockReturnValue(of({
  hits: {
    hits: [],
    total: 0
  }
}));

recordTestingService.getRecord.mockReturnValue(of({
  metadata: {
  }
}));

export const userTestingService: any = { };
const userTestingData = {
  first_name: 'John',
  last_name: 'Doe',
  library: {
    pid: '1',
    organisation: {
      pid: '1'
    },
    current: '1',
  },
  currentLibrary: '1',
  currentOrganisation: '1',
  getCurrentLibrary: () => '1'
};

const userTestingFn = vi.fn(() => userTestingData);
Object.assign(userTestingFn, userTestingData);
userTestingService.user = userTestingFn;

export const patronTestingService = {
  getItems: vi.fn(),
  currentPatron$: of({ pid: '1' }),
  getItemsPickup: vi.fn()
};
patronTestingService.getItems.mockReturnValue(of([]));
patronTestingService.getItemsPickup.mockReturnValue(of([]));
