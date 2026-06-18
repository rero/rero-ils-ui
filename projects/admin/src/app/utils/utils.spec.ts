// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

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
