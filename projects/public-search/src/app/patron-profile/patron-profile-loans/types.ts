// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { RecordData } from '@rero/ng-core';
import type { CanExtend } from '../../api/loan-api.service';

export type PatronLoan = RecordData<{
  pid: string;
  end_date: string;
  extension_count?: number;
  is_late?: boolean;
  due_soon_date?: string;
  overdue?: number;

  document: {
    pid: string;
  };

  library: {
    name: string;
  };

  item: {
    pid: string;
    call_number?: string;
    second_call_number?: string;

    location: {
      pid: string;
    };
  };
}> & {
  // Added by the store after calling canExtend()
  canExtend?: CanExtend;

  // Added locally after a successful renewal
  renewed?: boolean;
};
