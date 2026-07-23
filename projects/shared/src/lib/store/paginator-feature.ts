// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { patchState, signalMethod, signalStoreFeature, withMethods, withState } from "@ngrx/signals";
import { PaginatorState } from "primeng/paginator";
import { Pager } from "../component/paginator/model/paginator-model";

export function withPaginator<K extends string>(key: K, pager: Pager) {
  const changeMethod = `change${key.charAt(0).toUpperCase()}${key.slice(1)}` as `change${Capitalize<K>}`;

  return signalStoreFeature(
    withState({ [key]: pager } as Record<K, Pager>),
    withMethods(store => ({
      [changeMethod]: signalMethod<PaginatorState>(event => {
        const current = (store as any)[key]();
        if ((event.rows || pager.rows) !== current.rows) {
          event.page = 0;
          event.first = 1;
        }
        patchState(store as any, {
          [key]: {
            page: event.page + 1,
            first: event.page * (event.rows || pager.rows) + 1,
            rows: event.rows || pager.rows,
            rowsPerPageOptions: current.rowsPerPageOptions
          }
        } as Record<K, Pager>);
      })
    } as Record<`change${Capitalize<K>}`, ReturnType<typeof signalMethod<PaginatorState>>>))
  );
}
