// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
export type IEntityRelated = {
  authorized_access_point: string;
  pid: string;
  resource_type: string;
  type: string;
  icon: string;
}

/**
 * An entity of a document field, as described by the fields holding a `$ref`.
 * Every entry of these fields carries an entity, be it linked or textual, and every
 * entity carries a type. Only a linked one is resolved into a pid and a resource type.
 */
export type RawRelatedEntity = {
  entity: {
    type: string;
    pid?: string;
    resource_type?: string;
  } & Partial<
    /** Access point of a given language, i.e. `authorized_access_point_fre` */
    Record<`authorized_access_point_${string}`, string>
  >;
};
