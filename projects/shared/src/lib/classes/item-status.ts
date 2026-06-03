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
import { _ } from "@ngx-translate/core";

export enum ItemStatus {
  ON_SHELF = 'on_shelf',
  AT_DESK = 'at_desk',
  ON_LOAN = 'on_loan',
  IN_TRANSIT = 'in_transit',
  EXCLUDED = 'excluded',
  MISSING = 'missing',
}

export enum IssueItemStatus {
  DELETED = 'deleted',
  EXPECTED = 'expected',
  LATE = 'late',
  RECEIVED = 'received',
}

// Marquage pour extraction i18n (si nécessaire)
_('on_shelf');
_('at_desk');
_('on_loan');
_('in_transit');
_('excluded');
_('missing');
_('deleted');
_('expected');
_('late');
_('received');
