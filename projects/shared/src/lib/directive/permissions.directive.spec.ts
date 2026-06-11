/*
 * RERO ILS UI
 * Copyright (C) 2022 RERO
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
import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppStore } from '../store/app.store';
import { PermissionsDirective } from './permissions.directive';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'permissions-testing-component',
    imports: [PermissionsDirective],
    template: `
  <div id="perm" [permissions]="permissions">Permissions testing</div>`
})
class PermissionsTestingComponent {
  @Input() permissions: string[] | string = [];
}


describe('PermissionDirective', () => {
  let fixture: ComponentFixture<PermissionsTestingComponent>;
  let component: PermissionsTestingComponent;
  let canAccess = true;

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
    imports: [PermissionsTestingComponent],
    providers: [
      { provide: AppStore, useValue: { canAccess: vi.fn(() => canAccess) } }
    ]
})
    .createComponent(PermissionsTestingComponent);

    component = fixture.componentInstance;
    canAccess = true;
  });

  it('should create an instance', () => {
    expect(fixture).toBeTruthy();
  });

  it('should delete the element if the permission is not available', () => {
    canAccess = false;
    component.permissions = ['bar'];
    fixture.detectChanges();
    expect(fixture.elementRef.nativeElement.querySelector('#perm')).toBeNull();
  });

  it('should leave the element visible if permission is granted', () => {
    canAccess = true;
    component.permissions = ['foo'];
    fixture.detectChanges();
    expect(fixture.elementRef.nativeElement.querySelector('#perm')).toBeTruthy();
  });
});
