// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
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
