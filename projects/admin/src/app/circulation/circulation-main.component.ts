// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ConfirmDialogModule } from '@openng/optimus-ui/confirmdialog';
import { ToastModule } from '@openng/optimus-ui/toast';

import { CirculationStore } from './store/circulation.store';

// Required to shared the store between circulation components, as the main component is not a route component
@Component({
  selector: 'admin-circulation-main',
  providers: [CirculationStore],
  template: `<router-outlet></router-outlet>`,
  imports: [RouterOutlet, ToastModule, ConfirmDialogModule],
})
export class CirculationMainComponent {}
