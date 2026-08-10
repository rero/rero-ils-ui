// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later

/** An identifier of a match, as described by the `identifiedBy` field. */
export type RawIdentifier = {
  type: string;
  value: string;
};

/** An exact or close match of a remote entity, as described by the record. */
export type RawMatch = {
  authorized_access_point: string;
  source: string;
  identifiedBy?: RawIdentifier[];
};

/** An exact or close match of a remote entity, formatted for display. */
export type Match = {
  authorized_access_point: string;
  source: string;
  uri?: string;
};
