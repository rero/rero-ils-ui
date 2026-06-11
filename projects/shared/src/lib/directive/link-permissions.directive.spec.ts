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
