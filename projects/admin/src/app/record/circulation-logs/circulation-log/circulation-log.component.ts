// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
import { JsonPipe } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Bind } from '@openng/optimus-ui/bind';
import { Button } from '@openng/optimus-ui/button';
import { ScrollPanel } from '@openng/optimus-ui/scrollpanel';
import { DateTranslatePipe } from '@rero/ng-core';
import { AppStore, OpenCloseButtonComponent } from '@rero/shared';

@Component({
  selector: 'admin-circulation-log',
  templateUrl: './circulation-log.component.html',
  imports: [OpenCloseButtonComponent, Bind, Button, ScrollPanel, JsonPipe, TranslatePipe, DateTranslatePipe],
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
