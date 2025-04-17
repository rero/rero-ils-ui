/*
 * RERO ILS UI
 * Copyright (C) 2025 RERO
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
