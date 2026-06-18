// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { patchState, signalMethod, signalStoreFeature, withMethods, withState } from "@ngrx/signals";
import { PaginatorState } from "primeng/paginator";
import { Pager, Paginator } from "../component/paginator/model/paginator-model";

export function withPaginator(pager: Pager) {
  return signalStoreFeature(
    withState<Paginator>({
      pager: pager
    }),
    withMethods(store => ({
      changePage: signalMethod<PaginatorState>(event => {
        if ((event.rows || pager.rows) !== store.pager.rows()) {
          event.page = 0;
          event.first = 1;
        }
        patchState(store, {
          pager: {
            page: event.page + 1,
            first: event.page * (event.rows || pager.rows) + 1,
            rows: (event.rows || pager.rows),
            rowsPerPageOptions: store.pager().rowsPerPageOptions
          }
        });
      })
    }))
  );
}
