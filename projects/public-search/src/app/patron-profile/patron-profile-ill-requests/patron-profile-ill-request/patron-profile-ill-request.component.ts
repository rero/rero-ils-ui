// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Component, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { TagModule } from '@openng/optimus-ui/tag';
import { Nl2brPipe, RecordData, TruncateTextPipe } from '@rero/ng-core';
import { JournalVolumePipe, NotesFilterPipe, OpenCloseButtonComponent } from '@rero/shared';

import { LoanStatusBadgePipe } from '../../../pipe/loan-status-badge.pipe';

@Component({
  selector: 'public-search-patron-profile-ill-request',
  templateUrl: './patron-profile-ill-request.component.html',
  imports: [
    TranslatePipe,
    Nl2brPipe,
    TruncateTextPipe,
    JournalVolumePipe,
    NotesFilterPipe,
    OpenCloseButtonComponent,
    TagModule,
    LoanStatusBadgePipe,
  ],
})
export class PatronProfileIllRequestComponent {
  /** Ill record */
  record = input<RecordData>();

  /** Detail collapsed */
  isCollapsed = true;
}
