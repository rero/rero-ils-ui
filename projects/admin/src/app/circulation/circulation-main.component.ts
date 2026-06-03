/*
 * RERO ILS UI
 * Copyright (C) 2024-2025 RERO
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, version 3 of the License.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
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
