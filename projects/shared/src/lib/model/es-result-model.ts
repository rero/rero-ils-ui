// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { EsResult as NgCoreEsResult, RecordData } from '@rero/ng-core';

export type { Links } from '@rero/ng-core';

/**
 * A record of a record set returned by the API.
 *
 * `ng-core`'s `RecordData` with an untyped `metadata`, as the resources of
 * this application do not have metadata interfaces yet.
 */
export type EsRecord<TMetadata = any> = RecordData<TMetadata>;

/**
 * A record set returned by the API.
 *
 * `ng-core`'s `EsResult`, with `hits.total` narrowed to the plain integer that
 * every endpoint returns. Read the total directly, never as `total.value`.
 *
 * TODO: drop the narrowing and re-export `EsResult` as is once `ng-core`
 * narrows `SearchTotal` to `number` (rero-ils#4220).
 */
export type EsResult<TMetadata = any> = Omit<NgCoreEsResult<TMetadata>, 'hits'> & {
  hits: {
    hits: EsRecord<TMetadata>[];
    total: number;
  };
};

export const esResultInitialState: EsResult = {
  aggregations: {},
  hits: {
    hits: [],
    total: 0
  },
  links: {
    self: ''
  }
};
