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

/* eslint-disable */

export type EsRecord = {
  created: string;
  id: string;
  links: Links
  metadata: any,
  updated: string;
};

export type EsResult = {
  aggregations: {
    [key: string]: any;
  },
  hits: {
    hits: EsRecord[],
    total: {
      relation: string;
      value: number;
    }
  },
  links: Links;
};

export type Links = {
  create?: string;
  next?: string;
  prev?: string;
  self: string;
};

export const esResultInitialState: EsResult = {
    aggregations: {},
    hits: {
      hits: [],
      total: {
        relation: 'eq',
        value: 0
      }
    },
    links: {
      self: ''
    }
};
