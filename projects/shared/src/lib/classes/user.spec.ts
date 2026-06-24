// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { cloneDeep } from 'lodash-es';
import { testUserPatronLibrarian } from '../../tests/user';
import { User, UserConstructorData } from './user';

const testUserData: UserConstructorData = testUserPatronLibrarian;

describe('User', () => {
  let user: User;

  beforeEach(() => {
    user = new User(testUserData);
  });

  it('should create an instance', () => {
    expect(user).toBeTruthy();
  });

  it('should return false if the user is not present', () => {
    user = new User({ user: { ...testUserPatronLibrarian.user, username: '' }, patrons: [], permissions: [] });
    expect(user.isAuthenticated).toBeFalsy();
  });

  it('should return true if the user is present', () => {
    expect(user.isAuthenticated).toBeTruthy();
  });

  it('should return the parameter displayPatronMode', () => {
    expect(user.displayPatronMode).toBeTruthy();
    user.displayPatronMode = false;
    expect(user.displayPatronMode).toBeFalsy();
  });

  it('should return the parameter hasAdminUIAccess', () => {
    expect(user.hasAdminUiAccess).toBeTruthy();
  });

  it('should return the parameter patronLibrarian', () => {
    expect(user.patronLibrarian).toEqual(testUserPatronLibrarian.patrons![1]);
  });

  it('should return the parameter isPatron', () => {
    const data1 = { ...testUserData, patrons: cloneDeep(testUserPatronLibrarian.patrons!).splice(0, 1) };
    expect(new User(data1).isPatron).toBeTruthy();
    const data2 = { ...testUserData, patrons: cloneDeep(testUserPatronLibrarian.patrons!).splice(1, 1) };
    expect(new User(data2).isPatron).toBeFalsy();
  });

  it('should return the current library', () => {
    expect(user.currentLibrary).toBeUndefined();
    user.currentLibrary = '2';
    expect(user.currentLibrary).toEqual('2');
  });

  it('should return the current organisation', () => {
    expect(user.currentOrganisation).toBeUndefined();
    user.currentOrganisation = '1';
    expect(user.currentOrganisation).toEqual('1');
  });

  it('should return a boolean for hasRoles', () => {
    expect(user.hasRoles(['patron', 'librarian'])).toBeTruthy();
    expect(user.hasRoles(['patron', 'medium'])).toBeFalsy();
    expect(user.hasRoles(['patron', 'medium'], 'or')).toBeTruthy();
  });

  it('should return all roles of the patron (sort by name)', () => {
    expect(user.patronRoles).toEqual(['librarian', 'patron', 'system_librarian']);
  });

  it('should return the patron according to the organisation pid', () => {
    expect(user.getPatronByOrganisationPid('2')).toEqual(testUserPatronLibrarian.patrons![0]);
    expect(user.getPatronByOrganisationPid('unknown')).toBeUndefined();
  });

  it('should expose profile, patrons and permissions', () => {
    expect(user.profile).toEqual(testUserPatronLibrarian.user);
    expect(user.patrons).toEqual(testUserData.patrons);
    expect(user.permissions).toEqual(testUserData.permissions);
  });
});
