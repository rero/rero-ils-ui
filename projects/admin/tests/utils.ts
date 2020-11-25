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

export const recordTestingService = jasmine.createSpyObj(
  'RecordService', ['getRecords', 'getRecord']
);

recordTestingService.getRecords.and.returnValue(of({
  hits: {
    hits: [],
    total: 0
  }
}));

recordTestingService.getRecord.and.returnValue(of({
  metadata: {
  }
}));

export const userTestingService = jasmine.createSpyObj(
  'UserService', ['']
);
userTestingService.user =  {
  first_name: 'John',
  last_name: 'Doe',
  library: {
    pid: '1',
    organisation: {
      pid: '1'
    },
    current: '1',
  },
  getCurrentLibrary: () => '1'
};

export const patronTestingService = jasmine.createSpyObj(
  'PatronService', ['getItems', 'currentPatron$', 'getItemsPickup']
);
patronTestingService.getItems.and.returnValue(of([]));
patronTestingService.currentPatron$ = of({
  pid: '1'
});
patronTestingService.getItemsPickup.and.returnValue(of([]));
