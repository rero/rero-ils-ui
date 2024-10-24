/*
 * RERO ILS UI
 * Copyright (C) 2024 RERO
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
import { EventEmitter, Injectable, inject } from '@angular/core';
import { UserService } from '@rero/shared';
import { Observable } from 'rxjs';
import { LibrarySwitchStorageService } from './library-switch-storage.service';

export interface ISwitchLibrary {
  pid: string;
  code: string;
  name : string;
}

@Injectable({
  providedIn: 'root'
})
export class LibraryService {

  private userService: UserService = inject(UserService);
  private librarySwitchStorageService: LibrarySwitchStorageService = inject(LibrarySwitchStorageService);

  private switchEvent = new EventEmitter<ISwitchLibrary>();

  get switch$(): Observable<ISwitchLibrary> {
    return this.switchEvent.asObservable();
  }

  switch(library: ISwitchLibrary): void {
    this.librarySwitchStorageService.save({
      userId: this.userService.user.id,
      currentLibrary: library.pid,
      libraryName: library.name
    });
    this.userService.user.currentLibrary = library.pid;
    this.switchEvent.emit(library);
  }
}
