// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

/** An entity of a record field, restricted to the fields the entity link reads. */
export type EntityLinkEntity = {
  authorized_access_point?: string;
  resource_type?: string;
  pids?: Record<string, string>;
} & Partial<
  /** Access point of a given language, i.e. `authorized_access_point_fre` */
  Record<`authorized_access_point_${string}`, string>
>;
