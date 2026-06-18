// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Component, ChangeDetectionStrategy} from '@angular/core';
import { TranslateDirective } from '@ngx-translate/core';

@Component({
    selector: 'public-search-main',
    template: `
    <div class="ui:mt-2 ui:p-20 ui:bg-surface-50">
        <h1 class="ui:text-center" translate>Public search</h1>
    </div>
`,
    imports: [TranslateDirective],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainComponent { }
