/*
 * RERO ILS UI
 * Copyright (C) 2019-2022 RERO
 * Copyright (C) 2019-2022 UCLouvain
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
import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PatronService } from '../service/patron.service';

@Pipe({
  name: 'patronName'
})
export class PatronNamePipe implements PipeTransform {

  /**
   * Constructor
   * @param _patronService: PatronService
   */
  constructor(
    private _patronService: PatronService
  ) {}

  /**
   * Build the usage name for a patron based on its PID
   * @param patronPid - string: the patron pid
   * @returns an observable returning the patron name as string if patron exists.
   */
  transform(patronPid: string): Observable<undefined | string> {
    return this._patronService.getPatronByPid(patronPid).pipe(
      map((metadata: any) => this._patronService.getFormattedName(metadata))
    )
  }

}
