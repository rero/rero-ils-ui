// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Component, input, ChangeDetectionStrategy} from '@angular/core';
import { PredictionIssue } from '@app/admin/service/holdings.service';
import { TranslatePipe } from '@ngx-translate/core';
import { DateTranslatePipe } from '@rero/ng-core';

@Component({
    selector: 'admin-expected-issue',
    templateUrl: './expected-issue.component.html',
    imports: [TranslatePipe, DateTranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExpectedIssueComponent {

  issue = input<PredictionIssue>();

}
