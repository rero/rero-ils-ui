/*
 * RERO ILS UI
 * Copyright (C) 2019-2022 RERO
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

import { Injectable } from '@angular/core';
import { ILibrary, User, UserService } from '@rero/shared';
import { Subject } from 'rxjs';

export class LibrarySwitchError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'LibrarySwitchError';
  }
}

@Injectable({
  providedIn: 'root'
})
export class LibrarySwitchService {

  /** On library switch event */
  private onLibrarySwitch: Subject<User> = new Subject();

  /** Return library switch observable */
  get librarySwitch$() {
    return this.onLibrarySwitch.asObservable();
  }

  /**
   * Constructor
   * @param _userService - UserService
   */
  constructor(private _userService: UserService) { }

  /**
   * Switch library
   * @param libraryPid: the library pid that user would used
   * @error if the library is not present in list of libraries
   */
  switch(libraryPid: string): void {
    const user = this._userService.user;
    // we check the existence of the library in her libraries
    const libraries = user.patronLibrarian.libraries;
    if (!libraries.some((lib: ILibrary) => lib.pid === libraryPid)) {
      throw new LibrarySwitchError(
        `This library with pid ${libraryPid} is not available.`
      );
    }
    // Update current library on user
    user.currentLibrary = libraryPid;
    // Emit a new event with user
    this.onLibrarySwitch.next(user);
  }
}
