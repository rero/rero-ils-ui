/*
 * RERO ILS UI
 * Copyright (C) 2019-2024 RERO
 * Copyright (C) 2019-2023 UCLouvain
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
import { getTagSeverityFromStatus } from '@app/admin/utils/utils';
import { OpenCloseButtonComponent, JournalVolumePipe } from '@rero/shared';
import { Bind } from 'primeng/bind';
import { Tag } from 'primeng/tag';
import { Button } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { DateTranslatePipe, Nl2brPipe, TruncateTextPipe } from '@rero/ng-core';

@Component({
    selector: 'admin-ill-request-item',
    templateUrl: './ill-request-item.component.html',
    imports: [OpenCloseButtonComponent, Bind, Tag, Button, RouterLink, TranslateDirective, DateTranslatePipe, Nl2brPipe, TruncateTextPipe, JournalVolumePipe, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IllRequestItemComponent {

  // COMPONENT ATTRIBUTES =====================================================
  /** ILL record. */
  record = input<any>();
  /** Is detail is collapsed. */
  isCollapsed = true;

  // COMPONENT FUNCTIONS ======================================================
  /** get the primeng color to apply on the request status badge */
  badgeColor(status: string): string {
    return getTagSeverityFromStatus(status) ;
  }
}
