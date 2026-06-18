// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { inject, Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';


@Pipe({ name: 'patronBlockedMessage' })
export class PatronBlockedMessagePipe implements PipeTransform {

  protected translate: TranslateService = inject(TranslateService);

  /**
   * Display a message if patron is blocked
   * @param patron - Patron object
   */
  transform(patron: any): any {
    if (patron == null || patron.patron == null || patron.patron.blocked !== true) {
      return null;
    }
    return `${this.translate.instant('This patron is currently blocked.')} ${this.translate.instant('Reason')}: ${patron.patron.blocked_note}`;
  }
}
