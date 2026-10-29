// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Component, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Bind } from '@openng/optimus-ui/bind';
import { TableModule } from '@openng/optimus-ui/table';

@Component({
  selector: 'admin-report-data',
  templateUrl: './report-data.component.html',
  imports: [TranslatePipe, Bind, TableModule],
})
export class ReportDataComponent {
  // the report data to display
  data = input<unknown[][]>();
}
