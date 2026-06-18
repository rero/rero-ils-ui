// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { Nl2brPipe, RecordData, TruncateTextPipe } from '@rero/ng-core';
import { JournalVolumePipe, NotesFilterPipe, OpenCloseButtonComponent } from '@rero/shared';
import { TagModule } from 'primeng/tag';
import { LoanStatusBadgePipe } from '../../../pipe/loan-status-badge.pipe';

@Component({
    selector: 'public-search-patron-profile-ill-request',
    templateUrl: './patron-profile-ill-request.component.html',
    imports: [
      TranslateDirective,
      TranslatePipe,
      Nl2brPipe,
      TruncateTextPipe,
      JournalVolumePipe,
      NotesFilterPipe,
      OpenCloseButtonComponent,
      TagModule,
      LoanStatusBadgePipe,
    ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PatronProfileIllRequestComponent {

  /** Ill record */
  record = input<RecordData>();

  /** Detail collapsed */
  isCollapsed = true;
}
