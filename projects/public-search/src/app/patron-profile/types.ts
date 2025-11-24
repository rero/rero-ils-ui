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

import { EntityShape as SharedEntity } from '@rero/shared';

export type DocumentMetadata = {
  title: { type: string, _text: string }[];
  /** Entity used in contribution entries (authors, organisations...) */
  contribution?: { entity: SharedEntity; role?: string[] }[];
  [key: string]: unknown;
};

export type LoanRecord = {
  metadata: {
    item: {
      call_number?: string;
      second_call_number?: string;
      enumerationAndChronology?: string;
    };
    document?: {
      pid?: string;
    };
  };
};

export type IMenu = {
  value: string;
  name: string;
  selected?: boolean;
};


