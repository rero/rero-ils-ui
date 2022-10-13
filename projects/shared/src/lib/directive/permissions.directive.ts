/*
 * RERO ILS UI
 * Copyright (C) 2019-2022 RERO
 * Copyright (C) 2019-2022 UCLouvain
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
import { AfterViewInit, Directive, ElementRef, Input } from '@angular/core';
import { PermissionsService } from '../service/permissions.service';
import { PERMISSION_OPERATOR } from '../util/permissions';

@Directive({
   // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[permissions]'
})
export class PermissionsDirective implements AfterViewInit {

  // DIRECTIVE ATTRIBUTES =====================================================
  /** permissions */
  private _permissions: string[] = [];
  /** operator */
  private _operator: PERMISSION_OPERATOR = PERMISSION_OPERATOR.OR;

  // GETTER & SETTER ==========================================================
  @Input()
  set permissions(permissions: string[] | string) {
    if (typeof permissions === 'string') {
      permissions = [permissions];
    }
    this._permissions = permissions;
  };

  @Input()
  set operator(operator: PERMISSION_OPERATOR) {
    this._operator = operator;
  };

  // CONSTRUCTOR & HOOKS ======================================================
  /**
   * Constructor
   * @param _el - ElementRef
   * @param _permissionsService - PermissionsService
   */
  constructor(
    private _el: ElementRef,
    private _permissionsService: PermissionsService
  ) { }

  /** AfterViewInit hook */
  ngAfterViewInit(): void {
    // Remove element if not allowed
    if (!this._permissionsService.canAccess(this._permissions, this._operator)) {
      this._el.nativeElement.remove();
    }
  }
}
