// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { cloneDeep } from 'lodash-es';
import { testUserPatronLibrarian } from '../../tests/user';
import { User } from './user';

describe('User', () => {
  let user: User;
  beforeEach(() => {
    user = new User(testUserPatronLibrarian);
  });

  it('should create an instance', () => {
    expect(user).toBeTruthy();
  });

  it('should return false if the user is not present', () => {
    user = new User({});
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

  it('Should return the parameter hasAdminUIAccess', () => {
    expect(user.hasAdminUiAccess).toBeTruthy();
  });

  it('Should return the parameter patronLibrarian', () => {
    expect(user.patronLibrarian).toEqual(testUserPatronLibrarian.patrons![1]);
  });

  it('Should return the parameter isPatron', () => {
    const user1 = cloneDeep(testUserPatronLibrarian);
    const user2 = cloneDeep(testUserPatronLibrarian);
    user1.patrons = user1.patrons!.splice(0, 1);
    user = new User(user1);
    expect(user.isPatron).toBeTruthy();
    user2.patrons = user2.patrons!.splice(1, 1);
    user = new User(user2);
    expect(user.isPatron).toBeFalsy();
  });

  it('Should return the current library', () => {
    expect(user.currentLibrary).toBeUndefined();
    user.currentLibrary = '2';
    expect(user.currentLibrary).toEqual('2');
  });

  it('Should return the current organisation', () => {
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
    expect(user.getPatronByOrganisationPid('2')).toEqual(testUserPatronLibrarian.patrons![0]);
    expect(user.getPatronByOrganisationPid('unknown')).toBeUndefined();
  });
});
