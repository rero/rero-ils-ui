/*
 * RERO ILS UI
 * Copyright (C) 2021-2025 RERO
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
import { _ as marker } from "@ngx-translate/core";

export function _(str: any) {
  return marker(str);
}

export enum ItemStatus {
  ON_SHELF = _('on_shelf'),
  AT_DESK = _('at_desk'),
  ON_LOAN = _('on_loan'),
  IN_TRANSIT = _('in_transit'),
  EXCLUDED = _('excluded'),
  MISSING = _('missing')
}

export enum IssueItemStatus {
  DELETED = _('deleted'),
  EXPECTED = _('expected'),
  LATE = _('late'),
  RECEIVED = _('received')
}
