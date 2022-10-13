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
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PermissionsService } from '../service/permissions.service';
import { PermissionsTestingComponent } from './permissions-testing.component';
import { PermissionsDirective } from './permissions.directive';

describe('PermissionDirective', () => {
  let fixture: ComponentFixture<PermissionsTestingComponent>;
  let component: PermissionsTestingComponent;
  let permissionsService: PermissionsService;

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      declarations: [
        PermissionsDirective,
        PermissionsTestingComponent
      ]
    })
    .createComponent(PermissionsTestingComponent);

    component = fixture.componentInstance;
    permissionsService = TestBed.inject(PermissionsService);
    permissionsService.setPermissions(['foo']);
  });

  it('should create an instance', () => {
    expect(fixture).toBeTruthy();
  });

  it('should delete the element if the permission is not available', () => {
    component.permissions = ['bar'];
    fixture.detectChanges();
    expect(fixture.elementRef.nativeElement.querySelector('#perm')).toBeNull();
  });

  it('should leave the element visible if permission is granted', () => {
    component.permissions = ['foo'];
    fixture.detectChanges();
    expect(fixture.elementRef.nativeElement.querySelector('#perm')).toBeTruthy();
  });
});
