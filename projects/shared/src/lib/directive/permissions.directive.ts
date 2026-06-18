// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
import { AfterViewInit, Directive, ElementRef, inject, input } from '@angular/core';
import { AppStore } from '../store/app.store';
import { PERMISSION_OPERATOR } from '../util/permissions';

@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: '[permissions]' })
export class PermissionsDirective implements AfterViewInit {

  protected el: ElementRef = inject(ElementRef);
  protected appStore = inject(AppStore);

  readonly permissions = input<string[] | string>([]);
  readonly operator = input<PERMISSION_OPERATOR>(PERMISSION_OPERATOR.OR);

  /** AfterViewInit hook */
  ngAfterViewInit(): void {
    const perms = typeof this.permissions() === 'string'
      ? [this.permissions() as string]
      : this.permissions() as string[];
    // Remove element if not allowed
    if (!this.appStore.canAccess(perms, this.operator())) {
      this.el.nativeElement.remove();
    }
  }
}
