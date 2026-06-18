// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

/* eslint-disable */

export type EsRecord = {
  created: string;
  id: string;
  links: Links
  metadata: any,
  updated: string;
  [key: string]: any;
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
