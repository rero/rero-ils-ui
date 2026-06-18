// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
import { AfterViewInit, Directive, ElementRef, inject, input, Renderer2 } from '@angular/core';
import { AppStore } from '../store/app.store';
import { PERMISSION_OPERATOR } from '../util/permissions';

@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: '[linkPermissions]' })
export class LinkPermissionsDirective implements AfterViewInit {

  protected el: ElementRef = inject(ElementRef);
  protected renderer: Renderer2 = inject(Renderer2);
  protected appStore = inject(AppStore);

  readonly linkPermissions = input<string[] | string>([]);
  readonly linkPermissionsOperator = input<PERMISSION_OPERATOR>(PERMISSION_OPERATOR.OR);

  /** AfterViewInit hook */
  ngAfterViewInit(): void {
    const perms = typeof this.linkPermissions() === 'string'
      ? [this.linkPermissions() as string]
      : this.linkPermissions() as string[];
    if (!this.appStore.canAccess(perms, this.linkPermissionsOperator())) {
      const el: HTMLElement = this.el.nativeElement;
      const parent = el.parentNode;
      this.renderer.removeChild(parent, el);
      parent.append(this.el.nativeElement.textContent);
    }
  }
}
