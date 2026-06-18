// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
import { inject, Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PatronService } from '../service/patron.service';
import { formatPatronName } from '../utils/patron.utils';

@Pipe({ name: 'patronName' })
export class PatronNamePipe implements PipeTransform {

  private patronService: PatronService = inject(PatronService);

  /**
   * Build the usage name for a patron based on its PID
   * @param patronPid - string: the patron pid
   * @returns an observable returning the patron name as string if patron exists.
   */
  transform(patronPid: string): Observable<undefined | string> {
    return this.patronService.getPatronByPid(patronPid).pipe(
      map((metadata: any) => formatPatronName(metadata))
    )
  }

}
