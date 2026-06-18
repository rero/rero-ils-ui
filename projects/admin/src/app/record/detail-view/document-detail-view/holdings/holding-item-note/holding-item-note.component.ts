// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Component, input, ChangeDetectionStrategy} from '@angular/core';
import { ItemNote } from '@app/admin/classes/items';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'admin-holding-item-note',
    template: `
    @if (note()) {
      <dl class="metadata">
        <dt>{{ note().type.toString() | translate }}</dt>
        <dd [innerHTML]="note().content"></dd>
      </dl>
    }
  `,
    imports: [TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HoldingItemNoteComponent {
  /** the item note */
  note = input<ItemNote>();
}
