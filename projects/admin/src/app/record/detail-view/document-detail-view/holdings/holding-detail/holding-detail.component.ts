/*
 * RERO ILS UI
 * Copyright (C) 2020 RERO
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
