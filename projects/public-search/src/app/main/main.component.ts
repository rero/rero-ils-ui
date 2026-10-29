// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'public-search-main',
  template: `
    <div class="ui:mt-2 ui:p-20 ui:bg-surface-50">
      <h1 class="ui:text-center">{{ 'Public search' | translate }}</h1>
    </div>
  `,
  imports: [TranslatePipe],
})
export class MainComponent {}
