// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { roleTagSeverity } from "./roles";

describe('Roles', () => {

  it('should return the severity of the tag according to the role', () => {
    expect(roleTagSeverity('patron')).toEqual('primary');
    expect(roleTagSeverity('pro_full_permissions')).toEqual('danger');
    expect(roleTagSeverity('pro_read_only')).toEqual('help');
    expect(roleTagSeverity('pro_catalog_manager')).toEqual('success');
    expect(roleTagSeverity('pro_circulation_manager')).toEqual('warn');
    expect(roleTagSeverity('pro_user_manager')).toEqual('info');
    expect(roleTagSeverity('pro_acquisition_manager')).toEqual('secondary');
    expect(roleTagSeverity('pro_library_administrator')).toEqual('contrast');
    expect(roleTagSeverity('role_does_not_exist')).toEqual('secondary');
  });
});
