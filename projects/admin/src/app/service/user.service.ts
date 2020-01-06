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

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RecordService } from '@rero/ng-core';
import { forkJoin, of, Subject } from 'rxjs';
import { concatAll, map } from 'rxjs/operators';
import { User } from '../class/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private onUserLoaded: Subject<User> = new Subject();

  private user: User;

  get onUserLoaded$() {
    return this.onUserLoaded.asObservable();
  }

  constructor(
    private http: HttpClient,
    private recordService: RecordService
  ) { }

  getCurrentUser() {
    return this.user;
  }

  hasRole(role: string) {
    return this.getCurrentUser().hasRole(role);
  }

  hasRoles(roles: Array<string>) {
    return this.getCurrentUser().hasRoles(roles);
  }

  public loadLoggedUser() {
    this.http.get<any>(User.LOGGED_URL).subscribe(data => {
      const user = data.metadata;
      if (user && user.library) {
        user.currentLibrary = user.library.pid;
      }
      this.user = new User(user);
      this.onUserLoaded.next(data);
    });
  }

  getUser(pid: string) {
    return this.recordService.getRecord('patrons', pid, 1).pipe(
      map(data => {
        if (data) {
          const patron = new User(data.metadata);
          return forkJoin(
              of(patron),
              this.recordService.getRecord('patron_types', patron.patron_type.pid)
              ).pipe(
                map(patronAndType => {
                  const newPatron = patronAndType[0];
                  const patronType = patronAndType[1];
                  if (patronType) {
                    newPatron.patron_type = patronType.metadata;
                  }
                  return newPatron;
                })
          );
        }
      }),
      concatAll()
    );
  }
}
