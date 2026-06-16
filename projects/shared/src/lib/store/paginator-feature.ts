// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { patchState, signalMethod, signalStoreFeature, withMethods, withState } from "@ngrx/signals";
import { PaginatorState } from "primeng/paginator";
import { Pager, Paginator } from "../component/paginator/model/paginator-model";

/**
 * Build the next pager without modifying the PrimeNG event.
 * PrimeNG pages are zero-based while API pages and first records are one-based.
 * Changing the page size returns to the first page.
 */
export function nextPager(current: Pager, event: PaginatorState): Pager {
  const rows = event.rows ?? current.rows;
  const page = rows !== current.rows ? 0 : (event.page ?? 0);

  return {
    page: page + 1,
    first: page * rows + 1,
    rows,
    rowsPerPageOptions: current.rowsPerPageOptions
  };
}

export function withPaginator(pager: Pager) {
  return signalStoreFeature(
    withState<Paginator>({
      pager: pager
    }),
    withMethods(store => ({
      changePage: signalMethod<PaginatorState>(event => {
        patchState(store, {
          pager: nextPager(store.pager(), event)
        });
      })
    }))
  );
}
