/*
 * RERO ILS UI
 * Copyright (C) 2019-2024 RERO
 * Copyright (C) 2019-2023 UCLouvain
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
import { AfterViewInit, Directive, ElementRef, inject, Input, Renderer2 } from '@angular/core';
import { PermissionsService } from '../service/permissions.service';
import { PERMISSION_OPERATOR } from '../util/permissions';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[linkPermissions]',
})
export class LinkPermissionsDirective implements AfterViewInit {

  protected el: ElementRef = inject(ElementRef);
  protected renderer: Renderer2 = inject(Renderer2);
  protected permissionsService: PermissionsService = inject(PermissionsService);

  // DIRECTIVE ATTRIBUTES =====================================================
  /** permissions */
  private _permissions: string[] = [];
  /** operator */
  private _operator: PERMISSION_OPERATOR = PERMISSION_OPERATOR.OR;

  // GETTER & SETTER ==========================================================
  @Input()
  set linkPermissions(permissions: string[] | string) {
    if (typeof permissions === 'string') {
      permissions = [permissions];
    }
    this._permissions = permissions;
  };

  @Input()
  set linkPermissionsOperator(operator: PERMISSION_OPERATOR) {
    this._operator = operator;
  };

  /** AfterViewInit hook */
  ngAfterViewInit(): void {
    if (!this.permissionsService.canAccess(this._permissions, this._operator)) {
      const el : HTMLElement = this.el.nativeElement;
      const parent = el.parentNode;
      this.renderer.removeChild(parent, el);
      parent.append(this.el.nativeElement.textContent);
    }
  }
}
