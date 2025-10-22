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
import { patchState, signalMethod, signalStoreFeature, withMethods, withState } from "@ngrx/signals";
import { PaginatorState } from "primeng/paginator";

type Paginator = {
  paginator: PaginatorState
}

const rows = 10;

export const paginatorInitialState: Paginator = {
  paginator: {
    page: 1,
    first: 1,
    rows: rows
  }
};

export function withPaginator() {
  return signalStoreFeature(
    withState<Paginator>(paginatorInitialState),
    withMethods(store => ({
      changePage: signalMethod<PaginatorState>(event => {
        if (event.rows !== store.paginator.rows()) {
          event.page = 0;
          event.first = 1;
        }
        patchState(store, {
          paginator: {
            page: event.page + 1,
            first: event.page * (event.rows || rows) + 1,
            rows: (event.rows || rows)
          }
        });
      })
    }))
  );
}
