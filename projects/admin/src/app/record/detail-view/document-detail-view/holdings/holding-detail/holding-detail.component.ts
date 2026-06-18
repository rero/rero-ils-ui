// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Component, input, ChangeDetectionStrategy} from '@angular/core';
import { HoldingsNoteType, NotesFilterPipe } from '@rero/shared';
import { HoldingSharedViewComponent } from '../holding-shared-view/holding-shared-view.component';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { AsyncPipe } from '@angular/common';
import { DateTranslatePipe, GetRecordPipe, Nl2brPipe } from '@rero/ng-core';

@Component({
    selector: 'admin-holding-detail',
    templateUrl: './holding-detail.component.html',
    styles: ['dl.metadata > dd { font-weight: normal; }'],
    imports: [HoldingSharedViewComponent, TranslateDirective, AsyncPipe, TranslatePipe, DateTranslatePipe, GetRecordPipe, Nl2brPipe, NotesFilterPipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HoldingDetailComponent {

  /** Holding record */
  holding = input<any>();

  /** Context */
  context = input<'document'|'holdings'>('document');


  /** Get authorized types of note to be displayed */
  get noteAuthorizedTypes(): HoldingsNoteType[] {
    return (this.context() === 'document')
      ? [HoldingsNoteType.GENERAL, HoldingsNoteType.ACCESS]
      : Object.values(HoldingsNoteType);
  }
}
