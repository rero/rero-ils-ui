// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
export class QueryResponse {
  hits: any[];
  total: {
    value: number;
    relation: string;
  };
}
