// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingBarModule } from '@ngx-loading-bar/core';

@Component({
  selector: 'public-search-root',
  templateUrl: './app.component.html',
  imports: [LoadingBarModule, RouterOutlet],
})
export class AppComponent {}
