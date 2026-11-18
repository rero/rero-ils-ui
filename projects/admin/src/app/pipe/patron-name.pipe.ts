// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
import { HttpErrorResponse } from '@angular/common/http';
import { inject, Pipe, PipeTransform } from '@angular/core';
import { catchError, map, Observable, of, throwError } from 'rxjs';

import { PatronService } from '../service/patron.service';
import { formatPatronName } from '../utils/patron.utils';

@Pipe({ name: 'patronName' })
export class PatronNamePipe implements PipeTransform {
  private patronService: PatronService = inject(PatronService);

  /**
   * Build the usage name for a patron based on its PID
   * @param patronPid - string: the patron pid
   * @returns an observable returning the patron name, or an empty string if the patron does not exist anymore.
   */
  transform(patronPid: string): Observable<string> {
    return this.patronService.getPatronByPid(patronPid).pipe(
      map((metadata: any) => formatPatronName(metadata)),
      catchError((error: HttpErrorResponse) => ([404, 410].includes(error.status) ? of('') : throwError(() => error))),
    );
  }
}
