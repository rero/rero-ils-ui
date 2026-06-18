// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { ToastModule } from 'primeng/toast';

@Component({
    selector: 'public-patron-profile-app',
    templateUrl: './app.component.html',
    imports: [RouterOutlet, LoadingBarHttpClientModule, ToastModule]
})
export class AppComponent {

}
