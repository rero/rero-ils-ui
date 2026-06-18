// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

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
