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
import { PermissionsService } from '../service/permissions.service';
import { LinkPermissionsDirective } from './link-permissions.directive';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'link-permissions-testing-component',
    template: `
  <a href="#" id="link-perm" [linkPermissions]="linkPermissions">Link text</a>`,
    standalone: false
})
class LinkPermissionsTestingComponent {
  @Input() linkPermissions: string[] | string = [];
}


describe('LinkPermissionsDirective', () => {
  let fixture: ComponentFixture<LinkPermissionsTestingComponent>;
  let component: LinkPermissionsTestingComponent;
  let permissionsService: PermissionsService;

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      declarations: [
        LinkPermissionsDirective,
        LinkPermissionsTestingComponent
      ]
    })
    .createComponent(LinkPermissionsTestingComponent);

    component = fixture.componentInstance;
    permissionsService = TestBed.inject(PermissionsService);
    permissionsService.setPermissions(['foo']);
  });

  it('should create an instance', () => {
    expect(fixture).toBeTruthy();
  });

  it('should remove the link and show only link text', () => {
    component.linkPermissions = ['bar'];
    fixture.detectChanges();
    expect(fixture.elementRef.nativeElement.querySelector('a')).toBeNull();
    expect(fixture.elementRef.nativeElement.textContent).toEqual('Link text');
  });

  it('should leave the element visible if permission is granted', () => {
    component.linkPermissions = ['foo'];
    fixture.detectChanges();
    expect(fixture.elementRef.nativeElement.querySelector('a')).toBeTruthy();
  });
});
