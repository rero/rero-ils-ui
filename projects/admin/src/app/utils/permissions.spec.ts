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
import { CurrentLibraryPermissionValidator } from "./permissions";
import { UserService } from "@rero/shared";

describe('Permissions', () => {
  let service: CurrentLibraryPermissionValidator;

  const permissions = {
    create: { can: true },
    delete: { can: true },
    list: { can: true },
    read: { can: true },
    update: { can: true }
  }

  const deniedPermissions = {
    create: {
      can: false,
      reasons: {
        others: {
          record_not_in_current_library: ''
        }
      }
    },
    delete: {
      can: false,
      reasons: {
        others: {
          record_not_in_current_library: ''
        }
      }
    },
    list: { can: true },
    read: { can: true },
    update: {
      can: false,
      reasons: {
        others: {
          record_not_in_current_library: ''
        }
      }
    }
  }

  const userServiceSpy = jasmine.createSpyObj('UserService', ['']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CurrentLibraryPermissionValidator,
        { provide: UserService, useValue: userServiceSpy }
      ]
    });

    service = TestBed.inject(CurrentLibraryPermissionValidator);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return permissions unchanged', () => {
    userServiceSpy.user = { currentLibrary: 2 };
    expect(service.validate(permissions, '2')).toEqual(permissions);
  });

  it('should return permissions with access denied', () => {
    userServiceSpy.user = { currentLibrary: 3 };
    expect(service.validate(permissions, '2')).toEqual(deniedPermissions);
  });
});
