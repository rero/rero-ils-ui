// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Component } from '@angular/core';
import { RecordSearchPageComponent } from '@rero/ng-core';

@Component({
  selector: 'admin-migration-search-page',
  template: `<ng-core-record-search-page />`,
  imports: [RecordSearchPageComponent],
})
export class MigrationSearchPageComponent {}
