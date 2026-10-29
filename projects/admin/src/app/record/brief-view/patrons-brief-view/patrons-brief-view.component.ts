// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Component, inject, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { Bind } from '@openng/optimus-ui/bind';
import { Button } from '@openng/optimus-ui/button';
import { Tag } from '@openng/optimus-ui/tag';
import { DateTranslatePipe } from '@rero/ng-core';
import { AppStore, PERMISSIONS } from '@rero/shared';

import { roleTagSeverity } from '../../../utils/roles';

@Component({
  selector: 'admin-patrons-brief-view',
  templateUrl: './patrons-brief-view.component.html',
  imports: [RouterLink, Bind, Button, Tag, TranslatePipe, DateTranslatePipe],
})
export class PatronsBriefViewComponent {
  private appStore = inject(AppStore);
  private router = inject(Router);

  /** the record to display */
  record = input<any>();
  /** the record type */
  type = input<string>();
  /** the url to access detail view */
  detailUrl = input<{ link: string; external: boolean }>();

  /**
   * Circulation access check
   * @return true if the circulation permission is allowed
   */
  get circulationAccess(): boolean {
    return this.appStore.canAccess(PERMISSIONS.CIRC_ADMIN);
  }

  /**
   * Get the color badge to apply for a specific role
   * @param role: the role to check.
   * @return the primeng badge class to use for this role.
   */
  getRoleTagSeverity(role: string): string {
    return roleTagSeverity(role);
  }

  goToCirculation(barcode: string): void {
    this.router.navigate(['/circulation', 'patron', barcode, 'loan']);
  }
}
