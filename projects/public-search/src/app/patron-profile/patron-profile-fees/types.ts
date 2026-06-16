// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

export type Fee = {
  createdAt: Date;
  notes: string[];
  loan?: any;
  totalAmount: number;
  overdue?: number;
  type: string;
  transactions: any[];
};

export type OverdueFee = {
  fees: {
    steps: [],
    total: number;
  },
  loan: {
    pid: string;
  }
};
