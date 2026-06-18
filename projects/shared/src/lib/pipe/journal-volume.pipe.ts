// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { inject, Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({ name: 'journalVolume' })
export class JournalVolumePipe implements PipeTransform {

  private translateService: TranslateService = inject(TranslateService);

  /**
   * Transform
   * @param journal - Object
   * @param separator - string
   * @return string
   */
  transform(journal: { journal_title?: string, volume?: string, number?: string }, separator = ' — '): string {
    const data = [];
    if ('volume' in journal) {
      data.push(this.translateService.instant(
        'Vol. {{ volume }}', { volume: journal.volume }
      ));
    }
    if ('number' in journal) {
      data.push(this.translateService.instant(
        'n°. {{ number }}', { number: journal.number }
      ));
    }
    return data.join(separator);
  }
}
