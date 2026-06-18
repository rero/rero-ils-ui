// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CirculationStore } from './store/circulation.store';

// Required to shared the store between circulation components, as the main component is not a route component
@Component({
    selector: 'admin-circulation-main',
    providers: [CirculationStore],
    template: `<router-outlet></router-outlet>`,
    imports: [RouterOutlet, ToastModule, ConfirmDialogModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CirculationMainComponent {
}
