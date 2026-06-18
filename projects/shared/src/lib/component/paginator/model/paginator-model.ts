// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
export type Pager = {
  page: number;
  first: number;
  rows: number;
  rowsPerPageOptions: number[];
};

export type Paginator = {
  pager: Pager;
}
