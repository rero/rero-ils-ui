/*
 * RERO ILS UI
 * Copyright (C) 2021 RERO
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

import { cloneDeep } from 'lodash-es';
import { testPatronLibrarianRoles, testUserPatronLibrarian } from '../../tests/user';
import { User } from './user';

describe('User', () => {
  let user: User;
  beforeEach(() => {
    user = new User(testUserPatronLibrarian, testPatronLibrarianRoles);
  });

  it('should create an instance', () => {
    expect(user).toBeTruthy();
  });

  it('should return false if the user is not present', () => {
    user = new User({}, testPatronLibrarianRoles);
    expect(user.isAuthenticated).toBeFalsy();
  });

  it('Should return true if the user is present', () => {
    expect(user.isAuthenticated).toBeTruthy();
  });

  it('Should return the parameter displayPatronMode', () => {
    expect(user.displayPatronMode).toBeTruthy();
    user.displayPatronMode = false;
    expect(user.displayPatronMode).toBeFalsy();
  });

  it('Should return the parameter isAuthorizedAdminAccess', () => {
    expect(user.isAuthorizedAdminAccess).toBeTruthy();
  });

  it('Should return the parameter patronLibrarian', () => {
    expect(user.patronLibrarian).toEqual(testUserPatronLibrarian.patrons[1]);
  });

  it('Should return the parameter isPatron', () => {
    const user1 = cloneDeep(testUserPatronLibrarian);
    const user2 = cloneDeep(testUserPatronLibrarian);
    user1.patrons = user1.patrons.splice(0, 1);
    user = new User(user1, testPatronLibrarianRoles);
    expect(user.isPatron).toBeTruthy();
    user2.patrons = user2.patrons.splice(1, 1);
    user = new User(user2, testPatronLibrarianRoles);
    expect(user.isPatron).toBeFalsy();
  });

  it('Should return the parameter isLibrarian', () => {
    expect(user.isLibrarian).toBeTruthy();
  });

  it('Should return the parameter isSystemLibrarian', () => {
    expect(user.isSystemLibrarian).toBeTruthy();
  });

  it('Should return the parameter isSystemLibrarian', () => {
    expect(user.isSystemLibrarian).toBeTruthy();
  });

  it('Should return the current library', () => {
    expect(user.currentLibrary).toBeUndefined();
    user.currentLibrary = '2';
    expect(user.currentLibrary).toEqual('2');
  });

  it('Should return the current organistion', () => {
    expect(user.currentOrganisation).toBeUndefined();
    user.currentOrganisation = '1';
    expect(user.currentOrganisation).toEqual('1');
  });

  it('Should return a boolean for hasRoles', () => {
    expect(user.hasRoles(['patron', 'librarian'])).toBeTruthy();
    expect(user.hasRoles(['patron', 'medium'])).toBeFalsy();
    expect(user.hasRoles(['patron', 'medium'], 'or')).toBeTruthy();
  });

  it('should return all roles of the patron (sort by name)', () => {
    expect(user.patronRoles).toEqual(['librarian', 'patron', 'system_librarian']);
  });

  it('should return the patron according to the organisation pid', () => {
    const patron = JSON.stringify(user.getPatronByOrganisationPid('2'));
    const patronData = JSON.stringify(testUserPatronLibrarian.patrons[0]);
    expect(patron === patronData).toBeTruthy();
  });
});
