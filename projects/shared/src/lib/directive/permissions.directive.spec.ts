// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
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
