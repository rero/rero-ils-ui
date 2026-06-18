// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Component, inject, input, ChangeDetectionStrategy} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { RecordData } from '@rero/ng-core';

@Component({
    selector: 'shared-part-of',
    templateUrl: './part-of.component.html',
    imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PartOfComponent {

  protected translateService: TranslateService = inject(TranslateService);

  /** Document */
  readonly record = input<RecordData>();

  /** View code */
  readonly viewcode = input<string>(null);

  /** is public view */
  readonly isPublicView = input(false);

  /** Is it brief or detailed view? */
  readonly isBrief = input(true);

  /** Css class for dd in template */
  ddCssClass = 'col-sm-6 col-md-8 mb-0';

  /**
   * Get "part of" label from host document type
   * @param hostDocument - host document
   * @return corresponding translated label
   */
  getPartOfLabel(hostDocument: any): string {
    switch (hostDocument.metadata.issuance.subtype) {
      case 'periodical':
          return this.translateService.instant('Journal');
      case 'monographicSeries':
          return this.translateService.instant('Series');
      default:
           return this.translateService.instant('Published in');
    }
  }

  /**
   * Format "part of" numbering for display
   *
   * @param num: numbering to format
   * @return formatted numbering (example: 2020, vol. 2, nr. 3, p. 302)
   */
  formatNumbering(num: any): string {
    const numbering = [];
    if (num.year) {
      numbering.push(num.year);
    }
    if (num.volume) {
      const volume = [this.translateService.instant('vol'), num.volume];
      numbering.push(volume.join('. '));
    }
    if (num.issue) {
      const issue = [this.translateService.instant('nr'), num.issue];
      numbering.push(issue.join('. '));
    }
    if (num.pages) {
      const pages = [this.translateService.instant('p'), num.pages];
      numbering.push(pages.join('. '));
    }
    return numbering.join(', ');
  }
}
