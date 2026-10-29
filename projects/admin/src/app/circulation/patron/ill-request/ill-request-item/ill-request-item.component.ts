// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { getTagSeverityFromStatus } from '@app/admin/utils/utils';
import { TranslatePipe } from '@ngx-translate/core';
import { Bind } from '@openng/optimus-ui/bind';
import { Button } from '@openng/optimus-ui/button';
import { Tag } from '@openng/optimus-ui/tag';
import { DateTranslatePipe, Nl2brPipe, TruncateTextPipe } from '@rero/ng-core';
import { JournalVolumePipe, OpenCloseButtonComponent } from '@rero/shared';

@Component({
  selector: 'admin-ill-request-item',
  templateUrl: './ill-request-item.component.html',
  imports: [
    OpenCloseButtonComponent,
    Bind,
    Tag,
    Button,
    RouterLink,
    DateTranslatePipe,
    Nl2brPipe,
    TruncateTextPipe,
    JournalVolumePipe,
    TranslatePipe,
  ],
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
    return getTagSeverityFromStatus(status);
  }
}
