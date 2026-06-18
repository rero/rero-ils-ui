// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppStore } from '../store/app.store';
import { LinkPermissionsDirective } from './link-permissions.directive';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'link-permissions-testing-component',
    imports: [LinkPermissionsDirective],
    template: `
  <a href="#" id="link-perm" [linkPermissions]="linkPermissions">Link text</a>`
})
class LinkPermissionsTestingComponent {
  @Input() linkPermissions: string[] | string = [];
}


describe('LinkPermissionsDirective', () => {
  let fixture: ComponentFixture<LinkPermissionsTestingComponent>;
  let component: LinkPermissionsTestingComponent;
  let canAccess = true;

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
    imports: [LinkPermissionsTestingComponent],
    providers: [
      { provide: AppStore, useValue: { canAccess: vi.fn(() => canAccess) } }
    ]
})
    .createComponent(LinkPermissionsTestingComponent);

    component = fixture.componentInstance;
    canAccess = true;
  });

  it('should create an instance', () => {
    expect(fixture).toBeTruthy();
  });

  it('should remove the link and show only link text', () => {
    canAccess = false;
    component.linkPermissions = ['bar'];
    fixture.detectChanges();
    expect(fixture.elementRef.nativeElement.querySelector('a')).toBeNull();
    expect(fixture.elementRef.nativeElement.textContent).toEqual('Link text');
  });

  it('should leave the element visible if permission is granted', () => {
    canAccess = true;
    component.linkPermissions = ['foo'];
    fixture.detectChanges();
    expect(fixture.elementRef.nativeElement.querySelector('a')).toBeTruthy();
  });
});
