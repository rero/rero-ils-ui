// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later

import { ILLRequestStatus } from "../classes/ill-request";
import { LoanState } from "../classes/loans";

/**
 * Convert a level string to primeng level
 * @param level - string: the level string to convert
 * @return the severity of message (info by default)
 */
export function getSeverity(level: string) {
  switch (level) {
    case 'error':
      return 'error';
    case 'warning':
      return 'warn';
    case 'debug':
      return 'secondary';
    default:
      return 'info';
  }
}

export function getTagSeverityFromStatus(status: string): string {
  switch (status) {
    case ILLRequestStatus.PENDING:
    case LoanState.PENDING:
      return 'warn';
    case ILLRequestStatus.VALIDATED:
    case LoanState.ITEM_AT_DESK:
      return 'success';
    case ILLRequestStatus.DENIED:
      return 'danger';
    case LoanState.ITEM_ON_LOAN:
    case LoanState.ITEM_RETURNED:
      return 'info';
    default:
      return 'secondary';
  }
}
