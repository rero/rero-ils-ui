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

import { ILLRequestStatus } from "../classes/ill-request";
import { LoanState } from "../classes/loans";
import { getSeverity, getTagSeverityFromStatus } from "./utils";

describe('Utils', () => {

  it('should return the severity according to the level', () => {
    expect(getSeverity('error')).toEqual('error');
    expect(getSeverity('warning')).toEqual('warn');
    expect(getSeverity('debug')).toEqual('secondary');
    expect(getSeverity('not_severity')).toEqual('info');
  });

  it('should return the severity of the tag according to the status', () => {
    expect(getTagSeverityFromStatus(ILLRequestStatus.PENDING)).toEqual('warn');
    expect(getTagSeverityFromStatus(LoanState.PENDING)).toEqual('warn');
    expect(getTagSeverityFromStatus(ILLRequestStatus.VALIDATED)).toEqual('success');
    expect(getTagSeverityFromStatus(LoanState.ITEM_AT_DESK)).toEqual('success');
    expect(getTagSeverityFromStatus(ILLRequestStatus.DENIED)).toEqual('danger');
    expect(getTagSeverityFromStatus(LoanState.ITEM_ON_LOAN)).toEqual('info');
    expect(getTagSeverityFromStatus(LoanState.ITEM_RETURNED)).toEqual('info');
    expect(getTagSeverityFromStatus('status_does_not_exist')).toEqual('secondary');
  });
});
