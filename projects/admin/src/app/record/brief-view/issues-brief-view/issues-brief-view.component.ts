/*
 * RERO ILS UI
 * Copyright (C) 2019-2023 RERO
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

import { Component, inject, input, OnInit, ChangeDetectionStrategy} from '@angular/core';
import { RecordUiService, DateTranslatePipe, GetRecordPipe } from '@rero/ng-core';
import { IssueItemStatus, InheritedCallNumberComponent, ItemHoldingsCallNumberPipe } from '@rero/shared';
import { RouterLink } from '@angular/router';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { NgPlural, NgPluralCase, NgClass, AsyncPipe, JsonPipe } from '@angular/common';

@Component({
    selector: 'admin-issues-brief-view',
    templateUrl: './issues-brief-view.component.html',
    imports: [RouterLink, TranslateDirective, InheritedCallNumberComponent, NgPlural, NgPluralCase, NgClass, AsyncPipe, JsonPipe, TranslatePipe, DateTranslatePipe, GetRecordPipe, ItemHoldingsCallNumberPipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IssuesBriefViewComponent implements OnInit {

  protected recordUiService: RecordUiService = inject(RecordUiService);

  /** Record */
  record = input<any>();
  /** Type of record */
  type = input<string>();
  /** Detail Url */
  detailUrl = input<{ link: string, external: boolean }>();

  /** parent holding url */
  parentUrl: { link: string, external: boolean };
  /** reference to IssueItemStatus */
  issueItemStatus = IssueItemStatus;

  /** @return last claim date */
  get claimLastDate(): string {
    return this.record().metadata.issue.claims.dates
      .sort((a: string, b: string) => new Date(b).getTime() - new Date(a).getTime())[0];
  }

  /** OnInit hook */
  ngOnInit() {
    if (this.record()) {
      this.parentUrl = {
        link: `/records/holdings/detail/${this.record().metadata.holding.pid}`,
        external: false
      };
    }
  }

}
