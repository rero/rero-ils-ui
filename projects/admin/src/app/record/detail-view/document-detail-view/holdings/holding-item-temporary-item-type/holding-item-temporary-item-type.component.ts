// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Component, input, ChangeDetectionStrategy} from '@angular/core';
import { DateTime } from 'luxon';
import { TranslateDirective } from '@ngx-translate/core';
import { AsyncPipe } from '@angular/common';
import { DateTranslatePipe, GetRecordPipe } from '@rero/ng-core';

@Component({
    selector: 'admin-holding-item-temporary-item-type',
    template: `
    @if (hasTemporaryItemType()) {
      <dl class="metadata">
        <dt>
          <span class="text-warning" translate>Temporary item type</span>&nbsp;
          <i class="fa fa-exclamation-triangle text-warning"></i>
        </dt>
        <dd>
          {{ record().metadata.temporary_item_type.pid | getRecord:'item_types': 'field':'name' | async }}
          @if (record().metadata.temporary_item_type.end_date; as endDate) {
            &nbsp;<span class="ui:text-sm ui:text-muted-color">
              (<i class="fa fa-long-arrow-right" aria-hidden="true"></i> {{ endDate | dateTranslate :'shortDate' }})
            </span>
          }
        </dd>
      </dl>
    }
  `,
    imports: [TranslateDirective, AsyncPipe, DateTranslatePipe, GetRecordPipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HoldingItemTemporaryItemTypeComponent {

  /** Item record */
  record = input<any>();


  hasTemporaryItemType(): boolean {
    if ('temporary_item_type' in this.record().metadata) {
      const endDateValue = this.record().metadata.temporary_item_type.end_date || undefined;
      return !(endDateValue && DateTime.fromISO(endDateValue) < DateTime.now());
    }
    return false;
  }

}
