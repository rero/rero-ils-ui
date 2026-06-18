// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Component, input, ChangeDetectionStrategy } from "@angular/core";
import { Bind } from "primeng/bind";
import { TableModule } from "primeng/table";
import { TranslateDirective } from "@ngx-translate/core";

@Component({
    selector: "admin-report-data",
    templateUrl: "./report-data.component.html",
    imports: [Bind, TableModule, TranslateDirective],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportDataComponent {

  // the report data to display
  data = input<unknown[][]>();
}
