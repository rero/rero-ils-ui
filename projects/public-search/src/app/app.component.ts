// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Component, ChangeDetectionStrategy} from '@angular/core';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'public-search-root',
    templateUrl: './app.component.html',
    imports: [LoadingBarModule, RouterOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {

}
