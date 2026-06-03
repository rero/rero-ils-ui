/*
 * RERO ILS UI
 * Copyright (C) 2021-2024 RERO
 * Copyright (C) 2021-2023 UCLouvain
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
import { Component, inject, input, output, ChangeDetectionStrategy} from '@angular/core';
import { AppStore, OpenCloseButtonComponent } from '@rero/shared';
import { Bind } from 'primeng/bind';
import { Button } from 'primeng/button';
import { ScrollPanel } from 'primeng/scrollpanel';
import { JsonPipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { DateTranslatePipe } from '@rero/ng-core';

@Component({
    selector: 'admin-circulation-log',
    templateUrl: './circulation-log.component.html',
    imports: [OpenCloseButtonComponent, Bind, Button, ScrollPanel, JsonPipe, TranslatePipe, DateTranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CirculationLogComponent {

  private appStore = inject(AppStore);

  // COMPONENT ATTRIBUTES =====================================================
  /** Operation log record */
  record = input<any>();
  /** Is the log should be highlighted */
  isHighlight = input(false);
  /** Is the transaction must be separated from sibling elements */
  separator = input(false);

  /** Event for close dialog */
  closeDialogEvent = output();

  /** Event for is collapsed */
  isCollapsedEvent = output<boolean>();

  /** Circulation information's is collapsed */
  isCollapsed = true;

  /** debugMode */
  debugMode = false;

  // GETTER & SETTER ==========================================================
  /**
   * Is the debug mode could be activated ?
   * @returns True if the debug mode can be enabled and switched
   */
  get canUseDebugMode(): boolean {
    return this.appStore.canAccessDebugMode();
  }

  // COMPONENT FUNCTIONS ======================================================
  /** Close dialog */
  closeDialog(): void {
    this.closeDialogEvent.emit(null);
  }

  /** Toggle collapsed */
  toggleCollapsed(): void {
    this.isCollapsedEvent.emit(this.isCollapsed);
  }
}
